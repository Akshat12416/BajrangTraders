import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories`);
  return res.data.data;
};

export const getProductsByCategory = async (categoryCode) => {
  const res = await axios.get(`${API_BASE_URL}/products`);
  const all = res.data.data;
  return categoryCode ? all.filter(p => p.categoryCode === categoryCode) : all;
};

export const searchProducts = async (query) => {
  const res = await axios.get(`${API_BASE_URL}/products`, { params: { search: query } });
  return res.data.data;
};
