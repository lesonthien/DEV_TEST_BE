select 
--27/5 bs qrcode link
'https://redemption.forfun.vn/qrcode/'+ cast (vkey.id as nvarchar(255))+'.png'  qrcodeV1,
vkey.id id,
vkey.src Src,
vkey.sim SimNumber,
vkey.esimdata,
vkey.simtype Type,
pack.sku + pack.description Package,
vkey.type Status ,
vkey.Actived_Date Active_Date,
format(vkey.actived_date,'dd/MM/yyyy' ) actived_date,
format(vkey.created_date,'dd/MM/yyyy' ) buy_date,
u.fullname,
vkey.sim XploriID,
case when vshort.ex_code is not null then vshort.ex_code else  cast( vkey.[key] as nvarchar(255)) end ForfunID,
pack.Country,
temail.email,
redem.redemKey,
--Sim Nước nào, SKU, ngày nào kích hoạt, mã Xplori, thời gian mua
FORMATMESSAGE(
    N'Sim Nước: %s, SKU: %s, ngày kích hoạt: %s, mã Xplori: %s, thời gian mua: %s',
    pack.country,
    pack.sku,
    format(vkey.actived_date,'dd/MM/yyyy' ) ,
    vkey.sim,
    format(vkey.created_date,'dd/MM/yyyy' )
) copy_content
from forfun_sim_vkey vkey  
left join forfun_package pack on pack.productid=vkey.package
left join users u on u.id = vkey.assignTo
left join forfun_vkey_email temail on temail.vkey=vkey.[key]
left join forfun_vkey_shortcode vshort on vshort.vkey= vkey.[key]
left join forfun_redems redem on redem.actived_logkey = vkey.[logkey]
where vkey.actived_date is not null

union

  SELECT
            vkey.qr_code AS qrcodeV1,
            vkey.id AS id,
            'forfun_v2_ctv' AS Src,
            vkey.sim_id AS SimNumber,
            vkey_bk.response AS esim,
            vkey.sim_type AS Type,
            pack.sku + pack.description AS Package,
            CASE 
                WHEN vkey.status = 1 THEN 'Success'
                ELSE 'Failure'
            END AS Status,
            vkey.active_date AS Active_Date,
            FORMAT(vkey.active_date, 'dd/MM/yyyy') AS actived_date,
            FORMAT(vkey.create_at, 'dd/MM/yyyy') AS buy_date,
            u.fullname,
            vkey.sim_id AS XploriID,
            vkey.id AS ForfunID,
            pack.Country,
            vkey.email_order AS email,
            vkey.process_id AS redemKey,
            FORMATMESSAGE(
                N'Sim Nước: %s, SKU: %s, ngày kích hoạt: %s, mã Xplori: %s, thời gian mua: %s',
                pack.country,
                pack.sku,
                FORMAT(vkey.active_date, 'dd/MM/yyyy'),
                vkey.sim_id,
                FORMAT(vkey.create_at, 'dd/MM/yyyy')
            ) AS copy_content,
            JSON_QUERY('[]') AS [log]
        FROM forfun_v2_order_item vkey
        LEFT JOIN forfun_package pack ON pack.productid = vkey.package_id
        LEFT JOIN forfun_v2_order ord ON ord.id = vkey.order_id
        LEFT JOIN forfun_v2_order_item_booking vkey_bk ON vkey_bk.id = vkey.booking_id
        LEFT JOIN users u ON u.id = ord.account_id
        WHERE vkey.active_date IS NOT NULL