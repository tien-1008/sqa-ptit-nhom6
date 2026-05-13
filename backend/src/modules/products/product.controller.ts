import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  createProduct,
  deleteProduct,
  getPublicProduct,
  listAdminProducts,
  listCategories,
  listProducts,
  updateProduct
} from "./product.service.js";
import type { ProductListQuery } from "./product.schema.js";

export const listProductsController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Products loaded.",
    listProducts(request.query as ProductListQuery)
  );
};

export const getProductController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Product loaded.",
    getPublicProduct(Number(request.params.productId))
  );
};

export const listAdminProductsController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Admin products loaded.",
    listAdminProducts(request.query as ProductListQuery)
  );
};

export const listCategoriesController: RequestHandler = (_request, response) => {
  sendSuccess(response, "Categories loaded.", listCategories());
};

export const createProductController: RequestHandler = (request, response) => {
  sendSuccess(response, "Product created.", createProduct(request.body), 201);
};

export const updateProductController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Product updated.",
    updateProduct(Number(request.params.productId), request.body)
  );
};

export const deleteProductController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Product deleted.",
    deleteProduct(Number(request.params.productId))
  );
};
