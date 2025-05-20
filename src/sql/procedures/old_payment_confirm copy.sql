--declare  @jsonData nvarchar(max)=N'{"action":"update_order","orderId":"1d2fda21-7635-4599-a9b2-7af326638a58","order":{"OrderId":"1D2FDA21-7635-4599-A9B2-7AF326638A58","Amount":100000,"OrderDesc":"Thanh toán đơn hàng","CreatedDate":"/Date(1695699402113+0700)/","Status":0,"PaymentTranId":14124798,"PaymentClientId":"A833D84CCC2B41B2ADA86CD4C343AAE3","PaymentProvider":"vnpay_qr","PayStatus":1,"PaymentErrorString":null,"vnp_Returnurl":null}}'
--exec   [dbo].[proc_forfun_vnpayqr_confirm] @context=null, @userid=null,@jsonData=@jsonData
CREATE PROCEDURE [dbo].[proc_forfun_vnpayqr_confirm]
(
@context uuid null,
@userid  uuid null,
   @jsonData NVARCHAR(MAX)	
  
	)
AS

declare @tag nvarchar(255) = '[proc_forfun_vnpayqr_confirm]'
declare @message nvarchar(max) --log


declare @taskSuccess bit = 1
declare @taskStart datetime = getdate()
declare @logkey nvarchar(255)


--DECLARE @userId nvarchar(255) = CAST(dbo.ufn_getDataToQueryString(@jsonData, 'userId=', '') AS nvarchar(255));
DECLARE @orderId nvarchar(255) = json_value(@jsonData, '$.orderId')
DECLARE @PaymentTranId nvarchar(255) = json_value(JSON_QUERY( @jsonData,'$.order'), '$.PaymentTranId')
DECLARE @PayStatus nvarchar(255) = json_value(JSON_QUERY( @jsonData,'$.order'), '$.PayStatus')

select @logkey = logkey from forfun_order where id=@orderId
exec [libs.log.debug] @userid=@userid,@context=@logkey,@tag=@tag,@message=@jsonData
if (not exists(select * from forfun_order_payment where [paymentTranId]=@PaymentTranId))
begin

insert into forfun_order_payment([id]
           ,[paymentId]
           ,[paymentStatus]
           ,[paymentTranId]
           ,[orderId]
           ,[paymentConfirmTime]
           ,[paymentErrorString]
		   )
	select  newid() [id]
           ,PaymentProvider [paymentId]
           ,PayStatus [paymentStatus]
           ,PaymentTranId [paymentTranId]
           ,OrderId [orderId]
           ,getdate() [paymentConfirmTime]
           ,PaymentErrorString [paymentErrorString] 
	from openjson(JSON_QUERY( @jsonData,'$.order'))
	with(
	PaymentClientId [nvarchar](255),
	PaymentProvider [nvarchar](255),
	PayStatus [nvarchar](50) ,
	PaymentTranId [nvarchar](255) ,
	
	OrderId [nvarchar](50) ,
	
	PaymentErrorString [nvarchar](255) 
	)
	update forfun_order set payStatus=@PayStatus where id=@orderId
	if @PayStatus='PAID'
	begin
		set @context= @logkey --change logkey
		
		IF @orderId LIKE 'CTV_RECHARGE.%'
      BEGIN
        -- Thực hiện hành động khác ở đây

        RETURN
      END
    ELSE
    BEGIN
			exec [libs.log.info] @userid=@userid,@context=@logkey,@tag=@tag,@message=N'Khách hàng thực hiện thanh toán thành công'
			update forfun_order set status='PROCCESSING' where id=@orderId
			--processe order details


			exec [libs.log.info] @userid , @context, @tag , @message=N'Xử lý line item trong order details' 
			
			declare @line_items table(id nvarchar(255), sku nvarchar(255), quantity int,for_type nvarchar(255),simid nvarchar(255))
			--line_items
			insert into @line_items(id,sku,quantity,for_type,simid)
			select id, p.sku, quantity,for_type,simid 
			from forfun_order_detail t0 
			join forfun_package p on t0.productid=p.productid
			where orderid=@orderId
			
			declare @id nvarchar(255)
			declare @sku nvarchar(255)
			declare @quantity int
			declare @stt int =1
			declare @for_type nvarchar(255)
			declare @simid nvarchar(255)
			
			declare @obj nvarchar(max) = N'{}'

			set @obj = JSON_MODIFY(@obj,'$.email',(select email from users where id=(select customer_id from forfun_order where id=@orderid)))
			set @obj = JSON_MODIFY(@obj,'$.context',cast(@context as varchar(255)))
			set @obj = JSON_MODIFY(@obj,'$.userId',(select cast( customer_id as nvarchar(255)) from forfun_order where id=@orderid))
			set @obj = JSON_MODIFY(@obj,'$.logkey',cast (@context as nvarchar(255)))
			declare @totalRow int
			declare @title nvarchar(max)
			declare @body nvarchar(max)
			while (select count(1) from @line_items)>0
			begin
				set @id = (select top 1 id from @line_items)
				
				select  @sku=sku, @quantity=quantity,@for_type=for_type,@simid=simid from @line_items where id=@id
				delete @line_items where id=@id

				--excute order esim
					set @message  = N'Lấy sim for Sku ' + @sku  +', quantity: '+ cast(@quantity as nvarchar(255)) +@for_type
					exec [libs.log.info] @userid , @context, @tag, @message
					if @for_type='esim'
					begin
						while @stt<=@quantity
						begin
							exec [libs.log.info] @userid , @context, @tag, @message=N'Lấy esim'
							set @obj = JSON_MODIFY(@obj, '$.ref', @id) --tham chiếu haravan order
							set @obj = JSON_MODIFY(@obj, '$.src', 'APP') --tham chiếu haravan order
								set @obj = JSON_MODIFY(@obj,'$.sku',REPLACE( @sku,'E-',''))
							set @obj = JSON_MODIFY(@obj,'$.custcode',(select cast(customer_id as nvarchar(255)) from forfun_order where id=@orderId))
							SET @obj  = JSON_MODIFY(@obj,'$.actived_date',( select convert(nvarchar(255), actived_date,103) from forfun_order_detail where id=@id))
							if @simid is null or @simid=''
							begin
								exec [libs.log.debug] @userid , @context, @tag, @message='proc_forfun.getesim'
									exec [libs.log.debug] @userid , @context, @tag, @message=@obj
								exec [proc_forfun.getesim] @s=@obj, @totalRow=@totalRow output
							end
							else
							begin
									set @obj = JSON_MODIFY(@obj,'$.simid',@simid)
								declare @planid nvarchar(255) = newid()
								set @obj = JSON_MODIFY(@obj,'$.planid',@simid)
								exec [libs.log.debug] @userid , @context, @tag, @message='[proc_sim.addplan]'
								--insert forfun_sim_vkey
								insert into forfun_sim_vkey(id,ref,[key],[type],created_by,created_date,[package],simtype,[actived_date])
								select @planid id, @id ref, newid() [key],'SOLD' [type],@userid created_by, getdate() created_date,
								(select productid from forfun_package where sku=@sku ) [package], 'esim' simtype,( select actived_date from forfun_order_detail where id=@id) actived_date
								exec [libs.log.debug] @userid , @context, @tag, @message=@obj
								exec [proc_sim.addplan] @jsonData=@obj, @totalRow=@totalRow output
							end
							set @stt = @stt+1
							update forfun_order_detail set status='COMPLETED' where id=@id
						end					 
					end
					else
						begin
								set @title =N'App Order sim vật lý [' + @orderId +']'
							set @body = N'App Order sim vật lý [' + @orderId +']'
							exec [proc_libs.sendmail] @context=@context,@title=@title,@body=@body,@email='tamlac@forfun.vn'
							update forfun_order_detail set status='PROCCESSING' where id=@id
							--while @stt<=@quantity
							--begin
								-- exec [libs.log.info] @userid , @context, @tag, @message='Lấy physical sim, '
								-- set @obj = JSON_MODIFY(@obj, '$.ref', @hRef)
								-- set @stt = @stt+1
								--	 set @obj = JSON_MODIFY(@obj,'$.userId',cast(@userid as varchar(255)))				 							
							--		 set @obj = JSON_MODIFY(@obj,'$.sku',REPLACE( @sku,'P-',''))
								--	 --exec [proc_forfun.getsim] @s=@obj, @totalRow=@totalRow output
					
							--end			
						end

				set @stt =1
			end



			--check order complete
			if (select count(1) from forfun_order_detail where [status]='COMPLETED' and orderid=@orderId)=
			(select count(1) from forfun_order_detail where orderid=@orderId)
			begin
				update forfun_order set status='COMPLETED' where id=@orderId
			end
		END
	end
end
select N'{"result":0}' jsonResult

insert into forfun_tasklog(task,request_by,process_by,result,logkey,request_time,complete_time)
values(@tag,@userid,'SQL',iif(@taskSuccess=1,'SUCCESS','FAILURE'),@context,@taskStart,getdate())
