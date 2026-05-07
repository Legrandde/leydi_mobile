export interface Category {
  id: string;
  label: string;
  icon: string; // emoji ou nom d'icône
  color: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  bgColor: string;
  imageUri?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  imageUri: string;
}