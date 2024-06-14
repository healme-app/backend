import { FuelType, EVConnectorType } from './google-api.enum';
import { PlaceType, AddressType } from './google-place-type.enum';

interface AddressComponent {
  longText: string;
  shortText: string;
  types: AddressType[];
  languageCode: string;
}

interface PlusCode {
  globalCode: string;
  compoundCode: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface ViewPort {
  low: LatLng;
  high: LatLng;
}

interface Periode {
  open: Point;
  close?: Point;
}

interface Point {
  truncated?: boolean;
  day: number;
  hour: number;
  minute: number;
  date?: DateInfo;
}

interface DateInfo {
  year: integer;
  month: integer;
  day: integer;
}

interface LocalizedText {
  text: string;
  languageCode: string;
}

interface FuelPrice {
  type: FuelType;
  price: Money;
  updateTime: string;
}

interface Money {
  currencyCode: string;
  units: string;
  nanos: integer;
}

interface AuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

interface Review {
  name: string;
  relativePublishTimeDescription: string;
  text: LocalizedText;
  originalText: LocalizedText;
  rating: number;
  authorAttribution: AuthorAttribution;
  publishTime: Date;
}

interface SpecialDay {
  date: DateInfo;
}

interface OpeningHour {
  openNow?: boolean;
  periods: Periode[];
  weekdayDescriptions: string[];
  secondaryHoursType?: SecondaryHoursType;
  specialDays?: SpecialDay[];
}

interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: AuthorAttribution[];
}

interface Attribution {
  provider: string;
  providerUri: string;
}

interface SubDestination {
  name: string;
  id: string;
}

interface FuelOption {
  fuelPrices: FuelPrice[];
}

interface EVChargeOption {
  connectorCount: integer;
  connectorAggregation: ConnectorAggregation[];
}

interface ConnectorAggregation {
  type: EVConnectorType;
  maxChargeRateKw: number;
  count: integer;
  availabilityLastUpdateTime: string;
  availableCount: integer;
  outOfServiceCount: integer;
}

interface GooglePlace {
  name: string;
  id: string;
  displayName: LocalizedText;
  types: PlaceType[];
  primaryType: string;
  primaryTypeDisplayName: LocalizedText;
  nationalPhoneNumber: string;
  internationalPhoneNumber: string;
  formattedAddress: string;
  shortFormattedAddress: string;
  addressComponents: AddressComponent[];
  plusCode: PlusCode;
  location: LatLng;
  viewport: ViewPort;
  rating: number;
  googleMapsUri: string;
  websiteUri: string;
  reviews: Review[];
  regularOpeningHours: OpeningHour;
  photos: Photo[];
  adrFormatAddress: string;
  businessStatus: BussinessStatus;
  priceLevel?: PriceLevel;
  attributions?: Attribution;
  iconMaskBaseUri: string;
  iconBackgroundColor: string;
  currentOpeningHours: OpeningHour;
  currentSecondaryOpeningHours: OpeningHour[];
  regularSecondaryOpeningHours: OpeningHour[];
  editorialSummary: LocalizedText;
  paymentOptions: {
    acceptsCreditCards?: boolean;
    acceptsDebitCards?: boolean;
    acceptsCashOnly?: boolean;
    acceptsNfc?: boolean;
  };
  parkingOptions?: {
    freeParkingLot?: boolean;
    paidParkingLot?: boolean;
    freeStreetParking?: boolean;
    paidStreetParking?: boolean;
    valetParking?: boolean;
    freeGarageParking?: boolean;
    paidGarageParking?: boolean;
  };
  subDestinations?: SubDestination;
  fuelOptions?: FuelOption;
  evChargeOptions?: EVChargeOption[];
  utcOffsetMinutes: number;
  userRatingCount: number;
  takeout?: boolean;
  delivery?: boolean;
  dineIn?: boolean;
  curbsidePickup?: boolean;
  reservable?: boolean;
  servesBreakfast?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBeer?: boolean;
  servesWine?: boolean;
  servesBrunch?: boolean;
  servesVegetarianFood?: boolean;
  outdoorSeating?: boolean;
  liveMusic?: boolean;
  menuForChildren?: boolean;
  servesCocktails?: boolean;
  servesDessert?: boolean;
  servesCoffee?: boolean;
  goodForChildren?: boolean;
  allowsDogs?: boolean;
  restroom?: boolean;
  goodForGroups?: boolean;
  goodForWatchingSports?: boolean;
  accessibilityOptions: {
    wheelchairAccessibleParking?: boolean;
    wheelchairAccessibleEntrance?: boolean;
    wheelchairAccessibleRestroom?: boolean;
    wheelchairAccessibleSeating?: boolean;
  };
}

export class GooglePlaceNearbyResponse {
  places: GooglePlace[];
}