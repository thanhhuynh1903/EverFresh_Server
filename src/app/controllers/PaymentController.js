const { default: axios } = require("axios");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const DeliveryMethod = require("../models/DeliveryMethod");
const DeliveryInformation = require("../models/DeliveryInformation");
const Voucher = require("../models/Voucher");
const PaymentMethodEnum = require("../../enum/PaymentMethodEnum");
const Order = require("../models/Order");
const OrderStatusEnum = require("../../enum/OrderStatusEnum");

// Create a new Genus
const createMoMoPaymentUrl = asyncHandler(async (req, res) => {
  try {
    //Handle order logic
    const { voucher_id, delivery_method_id, delivery_information_id, cart_id } =
      req.body;

    if (!delivery_method_id || !cart_id) {
      res.status(400);
      throw new Error(
        "Payment method, delivery method, and cart ID are required"
      );
    }

    const cart = await Cart.findById(cart_id);
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    if (cart.list_cart_item_id.length === 0) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    const deliveryMethod = await DeliveryMethod.findById(delivery_method_id);
    if (!deliveryMethod) {
      res.status(404);
      throw new Error("Delivery method not found");
    }

    let deliveryInfo;
    if (delivery_information_id) {
      deliveryInfo = await DeliveryInformation.findById(
        delivery_information_id
      );
      if (!deliveryInfo) {
        res.status(404);
        throw new Error("Delivery information not found");
      }
    } else {
      deliveryInfo = await DeliveryInformation.findOne({
        user_id: req.user.id,
        is_default: true,
      });
      if (!deliveryInfo) {
        res.status(404);
        throw new Error("You must add Delivery information to order");
      }
    }

    let voucher = null;
    if (voucher_id) {
      voucher = await Voucher.findById(voucher_id);
      if (!voucher) {
        res.status(404);
        throw new Error("Voucher not found");
      }
    }

    const total_price = voucher
      ? cart.total_price -
        (cart.total_price * voucher.voucher_discount) / 100 +
        deliveryMethod.price
      : cart.total_price + deliveryMethod.price;

    // create momo url
    const partnerCode = process.env.PartnerCode;
    const accessKey = process.env.AccessKey;
    const secretKey = process.env.SecretKey;
    const MoMoApiUrl = process.env.MoMoApiUrl;
    const ipnUrl = process.env.ReturnMoMoPaymentUrl;
    const redirectUrl = process.env.ReturnMoMoPaymentUrl;
    const orderId = `${req.user.id}-${voucher_id}-${delivery_method_id}-${
      deliveryInfo._id
    }-${cart_id}-${new Date().getTime().toString()}`;
    const requestId = orderId;
    const orderInfo = `Thanh toán cho đơn hàng`;
    const requestType = "captureWallet";
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const amount = total_price;
    const lang = "vi";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    const options = {
      method: "POST",
      url: MoMoApiUrl,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      res.status(200).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else {
        console.error("Error:", error.message);
      }
      throw new Error("Không thể tạo yêu cầu thanh toán MoMo");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const paymentMoMoCallback = asyncHandler(async (req, res) => {
  try {
    const data = req.query.orderId.split("-");
    const customer_id = data[0];
    const voucher_id = data[1];
    const delivery_method_id = data[2];
    const delivery_information_id = data[3];
    const cart_id = data[4];

    const cart = await Cart.findById(cart_id);

    const deliveryMethod = await DeliveryMethod.findById(delivery_method_id);

    const deliveryInfo = await DeliveryInformation.findById(
      delivery_information_id
    );

    let voucher = null;
    if (voucher_id !== "undefined") {
      voucher = await Voucher.findById(voucher_id);
    }

    const total_price = voucher
      ? cart.total_price -
        (cart.total_price * voucher.voucher_discount) / 100 +
        deliveryMethod.price
      : cart.total_price + deliveryMethod.price;

    const newOrder = new Order({
      customer_id,
      payment_method: PaymentMethodEnum.MOMO,
      voucher_id: voucher_id !== "undefined" ? voucher_id : null,
      delivery_method: {
        delivery_method_name: deliveryMethod.delivery_method_name,
        price: deliveryMethod.price,
      },
      delivery_information: {
        phone_number: deliveryInfo.phone_number,
        address: deliveryInfo.address,
        address_detail: deliveryInfo.address_detail,
      },
      total_price: total_price,
      list_cart_item_id: cart.list_cart_item_id,
      status: OrderStatusEnum.CONFIRMED,
    });

    await newOrder.save();

    cart.list_cart_item_id = [];
    cart.total_price = 0;
    await cart.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createMoMoPaymentUrl,
  paymentMoMoCallback,
};
