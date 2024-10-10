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
const LinkedInformation = require("../models/LinkedInformation");
const User = require("../models/User");
const UserRankEnum = require("../../enum/UserRankEnum");
const VoucherStatusEnum = require("../../enum/VoucherStatusEnum");
const ProductTypeEnum = require("../../enum/ProductTypeEnum");
const PlanterCategoryEnum = require("../../enum/PlanterCategoryEnum");
const NotificationTypeEnum = require("../../enum/NotificationTypeEnum");
const Notification = require("../models/Notification");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createMoMoPaymentUrl = asyncHandler(async (req, res) => {
  try {
    //Handle order logic
    const { voucher_id, delivery_method_id, delivery_information_id, cart_id } =
      req.body;

    if (!delivery_method_id || !cart_id) {
      res.status(400);
      throw new Error("Delivery method, and cart ID are required");
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
      if (voucher.status !== VoucherStatusEnum.VALID) {
        res.status(400);
        throw new Error("Voucher is InValid");
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
    const orderId = `${req.user.id}-${
      voucher_id || new Date().getTime().toString()
    }-${delivery_method_id}-${deliveryInfo._id}-${cart_id}-${new Date()
      .getTime()
      .toString()}`;
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

const createUpRankMoMoPaymentUrl = asyncHandler(async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);
    if (customer.rank === UserRankEnum.PREMIUM) {
      res.status(400);
      throw new Error("User's rank already is PREMIUM");
    }

    // create momo url
    const partnerCode = process.env.PartnerCode;
    const accessKey = process.env.AccessKey;
    const secretKey = process.env.SecretKey;
    const MoMoApiUrl = process.env.MoMoApiUrl;
    const ipnUrl = process.env.ReturnMoMoPaymentUrl;
    const redirectUrl = process.env.ReturnMoMoPaymentUrl;
    const orderId = `${req.user.id}-df47s4as123s241123se-${new Date()
      .getTime()
      .toString()}-${new Date().getTime().toString()}-${new Date()
      .getTime()
      .toString()}-${new Date().getTime().toString()}`;
    const requestId = orderId;
    const orderInfo = `Up rank to Premium`;
    const requestType = "captureWallet";
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const amount = 79000;
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
    if (req.query.message === "Thành công.") {
      const data = req.query.orderId.split("-");
      const customer_id = data[0];
      const voucher_id = data[1];
      const delivery_method_id = data[2];
      const delivery_information_id = data[3];
      const cart_id = data[4];
      const currentTime = data[5];

      if (voucher_id !== "df47s4as123s241123se") {
        const cart = await Cart.findById(cart_id);

        const deliveryMethod = await DeliveryMethod.findById(
          delivery_method_id
        );

        const deliveryInfo = await DeliveryInformation.findById(
          delivery_information_id
        );

        let voucher = null;
        if (voucher_id !== currentTime) {
          voucher = await Voucher.findById(voucher_id);

          if (voucher.quantity <= 1) {
            voucher.status = VoucherStatusEnum.IN_VALID;
            await voucher.save();
          } else {
            voucher.quantity = voucher.quantity - 1;
            await voucher.save();
          }
        }

        const total_price = voucher
          ? voucher.is_percent
            ? cart.total_price -
              (cart.total_price * voucher.voucher_discount) / 100 +
              deliveryMethod.price
            : cart.total_price - voucher.voucher_discount + deliveryMethod.price
          : cart.total_price + deliveryMethod.price;

        const newOrder = new Order({
          order_code: req.query.orderId,
          customer_id,
          payment_method: PaymentMethodEnum.MOMO,
          voucher_id: voucher_id !== currentTime ? voucher_id : null,
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
          tracking_status_dates: [
            {
              key: "order_confirmed_date",
              value: new Date(),
            },
          ],
          status: OrderStatusEnum.CONFIRMED,
        });

        await newOrder.save();

        cart.list_cart_item_id = [];
        cart.total_price = 0;
        await cart.save();

        setImmediate(async () => {
          try {
            const notification = new Notification({
              user_id: customer_id,
              description: "You have purchasing order",
              type: NotificationTypeEnum.PURCHASING_ORDER,
            });

            await notification.save();

            const userNotifications = await Notification.find({
              user_id: customer_id,
            }).sort({ createdAt: -1 });
            _io.emit(`notifications-${customer_id}`, userNotifications);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        res.status(201).json(newOrder);
      } else {
        const upRankCustomer = await User.findByIdAndUpdate(
          customer_id,
          { rank: UserRankEnum.PREMIUM },
          { new: true }
        );
        if (!upRankCustomer) {
          res.status(400);
          throw new Error("Something went wrong when upgrading customer rank");
        }

        res.status(200).json(upRankCustomer);
      }
    } else {
      res.status(400);
      throw new Error("Payment Error");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const createStripePaymentUrl = asyncHandler(async (req, res) => {
  try {
    const {
      voucher_id,
      delivery_method_id,
      delivery_information_id,
      cart_id,
      linked_information_id,
    } = req.body;

    if (!delivery_method_id || !cart_id) {
      res.status(400);
      throw new Error("Delivery method, and cart ID are required");
    }

    const cart = await Cart.findById(cart_id).populate({
      path: "list_cart_item_id",
    });
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
      ).populate("user_id");
      if (!deliveryInfo) {
        res.status(404);
        throw new Error("Delivery information not found");
      }
    } else {
      deliveryInfo = await DeliveryInformation.findOne({
        user_id: req.user.id,
        is_default: true,
      }).populate("user_id");
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

      if (voucher.status !== VoucherStatusEnum.VALID) {
        res.status(400);
        throw new Error("Voucher is InValid");
      }
    }

    // Kiểm tra xem voucher có hợp lệ và tạo coupon trong Stripe nếu chưa có
    let coupon = null;
    if (voucher) {
      if (voucher.is_percent) {
        coupon = await stripe.coupons.create({
          percent_off: voucher.voucher_discount,
          duration: "once",
        });
      } else {
        coupon = await stripe.coupons.create({
          amount_off: voucher.voucher_discount,
          duration: "once",
          currency: "vnd",
        });
      }
    }

    let promotionCode = null;
    if (coupon) {
      promotionCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: voucher.code,
      });
    }

    const linkedInformation = await LinkedInformation.findById(
      linked_information_id
    );
    if (!linkedInformation) {
      res.status(404);
      throw new Error("Linked information not found");
    }

    const address_detail_info = deliveryInfo.address.split(",");

    // Tạo hoặc cập nhật customer trong Stripe
    let customer = await stripe.customers.list({
      email: req.user.email,
      limit: 1,
    });
    if (customer.data.length > 0) {
      customer = customer.data[0];
      await stripe.customers.update(customer.id, {
        shipping: {
          name: linkedInformation.author,
          phone: deliveryInfo.phone_number,
          address: {
            line1: deliveryInfo.address,
            line2: deliveryInfo.address_detail,
            state: address_detail_info[1],
            city: address_detail_info[2],
            country: "VN",
          },
        },
      });
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
        shipping: {
          name: linkedInformation.author,
          phone: deliveryInfo.phone_number,
          address: {
            line1: deliveryInfo.address,
            line2: deliveryInfo.address_detail,
            state: address_detail_info[1],
            city: address_detail_info[2],
            country: "VN",
          },
        },
      });
    }

    cart.list_cart_item_id.map((cart_item) => console.log(cart_item.product));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.list_cart_item_id.map((cart_item) => ({
        price_data: {
          currency: "vnd",
          product_data: {
            name:
              cart_item.product_type === ProductTypeEnum.PLANTER
                ? `${cart_item.product.name}`
                : `${cart_item.product.name}`,
            images:
              cart_item.product_type === ProductTypeEnum.PLANTER
                ? [cart_item.product.img_object[0].img_url]
                : cart_item.product.img_url,
            description: cart_item.product.describe
              ? cart_item.product.describe
              : "",
          },
          unit_amount: cart_item.product.price,
        },
        quantity: cart_item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: deliveryMethod.price,
              currency: "vnd",
            },
            display_name: deliveryMethod.delivery_method_name,
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 3,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
      ],
      customer: customer.id,
      discounts: promotionCode ? [{ promotion_code: promotionCode.id }] : [],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["VN"],
      },
      metadata: {
        order_id: `${req.user.id}-${
          voucher_id || new Date().getTime().toString()
        }-${delivery_method_id}-${deliveryInfo._id}-${cart_id}-${new Date()
          .getTime()
          .toString()}`,
      },
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // Hết hạn sau 30 phút
      success_url: `${process.env.ReturnStripePaymentUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ReturnStripePaymentUrl}?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log(session);
    return res.json({ url: session.url });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const createUpRankStripePaymentUrl = asyncHandler(async (req, res) => {
  try {
    let customer = await User.findById(req.user.id);
    if (customer.rank === UserRankEnum.PREMIUM) {
      res.status(400);
      throw new Error("User's rank already is PREMIUM");
    }

    customer = await stripe.customers.list({
      email: req.user.email,
      limit: 1,
    });
    if (customer.data.length > 0) {
      customer = customer.data[0];
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: {
              name: `Up rank to Premium`,
            },
            unit_amount: 79000,
          },
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: "payment",
      metadata: {
        order_id: `${req.user.id}-df47s4as123s241123se-${new Date()
          .getTime()
          .toString()}-${new Date().getTime().toString()}-${new Date()
          .getTime()
          .toString()}-${new Date().getTime().toString()}`,
      },
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // Hết hạn sau 30 phút
      success_url: `${process.env.ReturnStripePaymentUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ReturnStripePaymentUrl}?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log(session);
    return res.json({ url: session.url });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const paymentStripeCallback = asyncHandler(async (req, res) => {
  try {
    const result = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    if (result.payment_status === "paid") {
      const data = result.metadata.order_id.split("-");
      const customer_id = data[0];
      const voucher_id = data[1];
      const delivery_method_id = data[2];
      const delivery_information_id = data[3];
      const cart_id = data[4];
      const currentTime = data[5];

      if (voucher_id !== "df47s4as123s241123se") {
        const cart = await Cart.findById(cart_id);

        const deliveryMethod = await DeliveryMethod.findById(
          delivery_method_id
        );

        const deliveryInfo = await DeliveryInformation.findById(
          delivery_information_id
        );

        let voucher = null;
        if (voucher_id !== currentTime) {
          voucher = await Voucher.findById(voucher_id);

          if (voucher.quantity <= 1) {
            voucher.status = VoucherStatusEnum.IN_VALID;
            await voucher.save();
          } else {
            voucher.quantity = voucher.quantity - 1;
            await voucher.save();
          }
        }

        const total_price = voucher
          ? voucher.is_percent
            ? cart.total_price -
              (cart.total_price * voucher.voucher_discount) / 100 +
              deliveryMethod.price
            : cart.total_price - voucher.voucher_discount + deliveryMethod.price
          : cart.total_price + deliveryMethod.price;

        const newOrder = new Order({
          order_code: result.metadata.order_id,
          customer_id,
          payment_method: PaymentMethodEnum.STRIPE,
          voucher_id: voucher_id !== currentTime ? voucher_id : null,
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
          tracking_status_dates: [
            {
              key: "order_confirmed_date",
              value: new Date(),
            },
          ],
          status: OrderStatusEnum.CONFIRMED,
        });

        await newOrder.save();

        cart.list_cart_item_id = [];
        cart.total_price = 0;
        await cart.save();

        setImmediate(async () => {
          try {
            const notification = new Notification({
              user_id: customer_id,
              description: "You have purchasing order",
              type: NotificationTypeEnum.PURCHASING_ORDER,
            });

            await notification.save();

            const userNotifications = await Notification.find({
              user_id: customer_id,
            }).sort({ createdAt: -1 });
            _io.emit(`notifications-${customer_id}`, userNotifications);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        res.status(201).json(newOrder);
      } else {
        const upRankCustomer = await User.findByIdAndUpdate(
          customer_id,
          { rank: UserRankEnum.PREMIUM },
          { new: true }
        );
        if (!upRankCustomer) {
          res.status(400);
          throw new Error("Something went wrong when upgrading customer rank");
        }

        res.status(200).json(upRankCustomer);
      }
    } else {
      res.status(400);
      throw new Error("Payment Error");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createMoMoPaymentUrl,
  createUpRankMoMoPaymentUrl,
  paymentMoMoCallback,
  createStripePaymentUrl,
  createUpRankStripePaymentUrl,
  paymentStripeCallback,
};
