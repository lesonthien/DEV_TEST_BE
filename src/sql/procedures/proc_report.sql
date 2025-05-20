CREATE PROCEDURE dbo.[proc_forfun_v2.report](
@s NVARCHAR(4000),
@totalRow INT OUTPUT,
@currentPage INT = 1
-- Default current page is 1
	)
AS
--[{time,from_platenumber,to_platenumber,lat,lng,code,quantity}]
DECLARE @json NVARCHAR(max) = '{"result":0,"message":"","data":{},"data_2":[]}'
DECLARE @provinceCode NVARCHAR(255) = '42'
DECLARE @context uuid = CAST(dbo.ufn_getDataToQueryString(@s,
'context=',
newid()) AS uuid);

declare @total nvarchar(max) = '{
	"total_sim":120,
	"total_esim_actived":2,
	"total_plan_actived":150,
	"total_chanel":2,
	"total_ctv":2,
	"details":[]
}'
--select  * from forfun_sim_vkey

    SET @total = JSON_MODIFY(@total, '$.total_sim_forfun_v2', (SELECT COUNT(id) FROM forfun_v2_order_item))
    SET @total = JSON_MODIFY(@total, '$.total_esim_actived_forfun_v2', (SELECT COUNT(id) FROM forfun_v2_order_item WHERE active_date IS NOT NULL AND (sim_type IS NULL OR sim_type = 1)))
    SET @total = JSON_MODIFY(@total, '$.total_plan_actived_forfun_v2', (SELECT COUNT(id) FROM forfun_v2_order_item))
    
set
@total = JSON_MODIFY(@total,
'$.total_sim',
(
select
	count(id)
from
	forfun_sim_vkey
where
	type = 'SOLD'
	and len([key])<12))
	
	---
set
@total = JSON_MODIFY(@total,
'$.total_esim_actived',
(
select
	count(id)
from
	forfun_sim_vkey
where
	type = 'SOLD'
	and actived_date is not null
	and (simtype is null
		or simtype = 'esim')))
		--
set
@total = JSON_MODIFY(@total,
'$.total_plan_actived',
(
select
	count(id)
from
	forfun_sim_vkey
where
	type = 'SOLD' ))
 ---
set
@total = json_modify(@total,
'$.details',
json_query((
SELECT
	*
from
	(
	select
		--27/5 bs qrcode link
'https://redemption.forfun.vn/qrcode/' + cast (vkey.id as nvarchar(255))+ '.png' qrcodeV1,
		vkey.id id,
		vkey.src Src,
		vkey.sim SimNumber,
		vkey.esimdata AS esimdata,
		FORMATMESSAGE( N'%s',
		vkey.simtype) AS Type,
		pack.sku + pack.description Package,
		vkey.type Status ,
		vkey.Actived_Date Active_Date,
		format(vkey.actived_date,
		'dd/MM/yyyy' ) actived_date,
		format(vkey.created_date,
		'dd/MM/yyyy' ) buy_date,
		u.fullname,
		vkey.sim XploriID,
		case
			when vshort.ex_code is not null then vshort.ex_code
			else cast( vkey.[key] as nvarchar(255))
		end ForfunID,
		pack.Country,
		temail.email,
		redem.redemKey,
		--Sim Nước nào, SKU, ngày nào kích hoạt, mã Xplori, thời gian mua
		FORMATMESSAGE(
    N'Sim Nước: %s, SKU: %s, ngày kích hoạt: %s, mã Xplori: %s, thời gian mua: %s',
		pack.country,
		pack.sku,
		format(vkey.actived_date,
		'dd/MM/yyyy' ) ,
		vkey.sim,
		format(vkey.created_date,
		'dd/MM/yyyy' )
) copy_content,
		json_query((
		select
			(case
				when [log] like 'Request xplori qrcode cho khach hang: Success%' 
then 'Request xplori qrcode cho khach hang: Success'
				when [log] like 'Request xplori qrcode cho khach hang: Failure%' 
then 'Request xplori qrcode cho khach hang: Failure'
				else 
	[log]
			end)
content,
			*
		from
			logtraces
		where
			[Context] = vkey.logkey
			and level <> 'DEBUG'
		order by
			time for json path)) [log]
	from
		forfun_sim_vkey vkey
	left join forfun_package pack on
		pack.productid = vkey.package
	left join users u on
		u.id = vkey.assignTo
	left join forfun_vkey_email temail on
		temail.vkey = vkey.[key]
	left join forfun_vkey_shortcode vshort on
		vshort.vkey = vkey.[key]
	left join forfun_redems redem on
		redem.actived_logkey = vkey.[logkey]
	where
		vkey.actived_date is not null
union
	SELECT
		vkey.qr_code AS qrcodeV1,
		vkey.id AS id,
		'forfun_v2_ctv' AS Src,
		vkey.sim_id AS SimNumber,
		vkey_bk.response AS esimdata,
		FORMATMESSAGE( N'%s',
		vkey.sim_type) AS Type,
		pack.sku + pack.description AS Package,
		CASE
			WHEN vkey.status = 1 THEN 'Success'
			ELSE 'Failure'
		END AS Status,
		vkey.active_date AS Active_Date,
		FORMAT(vkey.active_date,
		'dd/MM/yyyy') AS actived_date,
		FORMAT(vkey.create_at,
		'dd/MM/yyyy') AS buy_date,
		u.fullname,
		vkey.sim_id AS XploriID,
		convert(nvarchar(36),
		vkey.id) ForfunID,
		pack.Country,
		vkey.email_order AS email,
		vkey.process_id AS redemKey,
		FORMATMESSAGE(
                N'Sim Nước: %s, SKU: %s, ngày kích hoạt: %s, mã Xplori: %s, thời gian mua: %s',
		pack.country,
		pack.sku,
		FORMAT(vkey.active_date,
		'dd/MM/yyyy'),
		vkey.sim_id,
		FORMAT(vkey.create_at,
		'dd/MM/yyyy')
            ) AS copy_content,
		JSON_QUERY('[]') AS [log]
	FROM
		forfun_v2_order_item vkey
	LEFT JOIN forfun_package pack ON
		pack.productid = vkey.package_id
	LEFT JOIN forfun_v2_order ord ON
		ord.id = vkey.order_id
	LEFT JOIN forfun_v2_order_item_booking vkey_bk ON
		vkey_bk.id = vkey.booking_id
	LEFT JOIN users u ON
		u.id = ord.account_id
	WHERE
		vkey.active_date IS NOT NULL) as result
order by
	result.buy_date desc
OFFSET (@currentPage - 1) * @totalRow ROWS FETCH NEXT @totalRow ROWS ONLY
	-- Pagination logic
for json path,
	include_null_values)))
--số lượng thiết bị
--select * from forfun_sim


SET
@json = json_modify(@json,
'$.data',
json_query(@total)
					)

	SELECT
	@json jsonResult
	--select * from forfun_sim_vkey
