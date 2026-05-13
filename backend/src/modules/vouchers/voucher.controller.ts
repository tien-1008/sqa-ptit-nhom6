import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  applyVoucherToCart,
  createVoucher,
  listVouchers
} from "./voucher.service.js";

export const applyVoucherController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Voucher applied.",
    applyVoucherToCart(request.user!.id, request.body.code)
  );
};

export const listVouchersController: RequestHandler = (_request, response) => {
  sendSuccess(response, "Vouchers loaded.", listVouchers());
};

export const createVoucherController: RequestHandler = (request, response) => {
  sendSuccess(response, "Voucher created.", createVoucher(request.body), 201);
};
