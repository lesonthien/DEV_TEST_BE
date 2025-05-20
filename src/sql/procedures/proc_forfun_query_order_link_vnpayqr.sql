CREATE PROCEDURE [dbo].[proc_forfun_query_order_link_vnpayqr]
(
    @context uuid NULL,
    @userid uuid NULL,
    @jsonData NVARCHAR(MAX)  
)
AS
BEGIN
    DECLARE @orderId NVARCHAR(255) = JSON_VALUE(@jsonData, '$.orderId')
    DECLARE @data NVARCHAR(MAX)
    DECLARE @actualOrderId NVARCHAR(255)

    -- Kiểm tra nếu orderId có cấu trúc "CTV.id123123123"
    IF @orderId LIKE 'CTV_RECHARGE.%'
    BEGIN
        -- Lấy phần sau "CTV."
        SET @actualOrderId = SUBSTRING(@orderId, CHARINDEX('.', @orderId) + 1, LEN(@orderId))

        -- Truy vấn với phần sau "CTV."
        SET @data = (
            SELECT 
                t0.id,
                GETDATE() AS CreatedDate,
                t0.id AS OrderId,
                t0.total_price AS Amount,
                N'Thanh toán nạp tiền vào ví ' AS OrderDesc,
                t0.status AS Status,
                REPLACE(CAST(NEWID() AS NVARCHAR(255)), '-', '') AS PaymentClientId,
                'vnpay_qr' AS PaymentProvider,
                'CREATED' AS PayStatus
            FROM 
                forfun_order t0 
            WHERE 
                t0.id = @actualOrderId
                AND t0.status = 'CREATED'
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )
    END
    ELSE
    BEGIN
        -- Nếu orderId không có prefix là "CTV", thực hiện truy vấn với chính orderId
        SET @data = (
            SELECT 
                t0.id,
                GETDATE() AS CreatedDate,
                t0.id AS OrderId,
                t0.total_price AS Amount,
                N'Thanh toán đơn hàng' AS OrderDesc,
                t0.status AS Status,
                REPLACE(CAST(NEWID() AS NVARCHAR(255)), '-', '') AS PaymentClientId,
                'vnpay_qr' AS PaymentProvider,
                'CREATED' AS PayStatus
            FROM 
                forfun_order t0 
            WHERE 
                t0.id = @orderId
                AND t0.status = 'CREATED'
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )
    END

    SELECT @data AS jsonResult
END
