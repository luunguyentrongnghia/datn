export interface User {
  id: string;
  email: string;
  fullname: string;
  phone: string | null;
  avatar: string | null;
}
export interface District {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface Ward {
  id: number;
  name: string;
}

export interface PackageType {
  id: string;
  name: string;
  isDisplayImedialy: boolean;
  isShowDecription: boolean;
  isShowDetails: boolean;
  isShowContactInfo: boolean;
  color: string;
}

export interface PropertyType {
  id: string;
  name: string;
  listingType: string;
  direction: boolean;
  balonDirection: boolean;
  Deposit_amount: boolean;
  Horizontal: boolean;
  Land_status: boolean;
  Legal: boolean;
  Length: boolean;
  ResidentialArea: boolean;
  Road: boolean;
  bathroom: boolean;
  bedroom: boolean;
  floor: boolean;
  isFurniture: boolean;
}

export interface MainImage {
  id: string;
  image_url: string;
  is_main: boolean;
  caption: string | null;
}

export interface Listing {
  Deposit_amount: string | null;
  Horizontal: number | null;
  Land_status: string | null;
  Legal: string | null;
  Length: number | null;
  ResidentialArea: number | null;
  Road: string | null;
  address: string | null;
  avgStar: number | null;
  balonDirection: string | null;
  bathroom: number | null;
  bedroom: number | null;
  createdAt: string | null;
  description: string | null;
  direction: string | null;
  displayDays: number | null;
  district: District;
  end_date: string | null;
  floor: number | null;
  id: string;
  idUser: User;
  isFurniture: string | null;
  mainImage: MainImage[];
  package_type: PackageType;
  price: string | null;
  property_type_id: PropertyType;
  province: Province;
  square_meter: number | null;
  start_date: string | null;
  status: string | null;
  title: string | null;
  totalCost: number | null;
  updatedAt: string | null;
  video_id: string | null;
  video_url: string | null;
  ward: Ward;
}
export interface UpdatePostUserProp {
  dataDefault: Listing;
  handleGetData: () => Promise<void>;
}
export interface PropPropertyUser {
  prop: Listing;
}
