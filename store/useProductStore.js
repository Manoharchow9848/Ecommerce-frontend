import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";


export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const token = localStorage.getItem("token");
			const res = await axiosInstance.post("/products", productData,{
				headers:{
					Authorization: `Bearer ${token}`,
				}
			});
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			console.log(error);
			
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const token = localStorage.getItem("token");
			const response = await axiosInstance.get("/products",{
				headers:{
					Authorization: `Bearer ${token}`,
				}
			});
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error?.response?.data?.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		console.log(category);
		
		try {
			const token = localStorage.getItem("token");
			const response = await axiosInstance.get(`/products/category/${category}`,{
				headers:{
					Authorization: `Bearer ${token}`,
				}
				
				
			});
			console.log(response.data);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			const token = localStorage.getItem("token");
			await axiosInstance.delete(`/products/${productId}`,{
				headers:{
					Authorization: `Bearer ${token}`,
				}
			});
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const token = localStorage.getItem("token");
			
			
			const response = await axiosInstance.patch(`/products/${productId}`,{},{
				headers:{
					Authorization: `Bearer ${token}`,
				}
			});
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			console.log(error);
			
			toast.error(error?.response?.data?.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const token = localStorage.getItem("token");
			const response = await axiosInstance.get("/products/featured",{
				headers:{
					Authorization: `Bearer ${token}`,
				}
			});
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));
