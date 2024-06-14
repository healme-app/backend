type GooFieldMaskNearbyBasic =
  | 'places.accessibilityOptions'
  | 'places.addressComponents'
  | 'places.adrFormatAddress'
  | 'places.businessStatus'
  | 'places.displayName'
  | 'places.formattedAddress'
  | 'places.googleMapsUri'
  | 'places.iconBackgroundColor'
  | 'places.iconMaskBaseUri'
  | 'places.id'
  | 'places.location'
  | 'places.name'
  | 'places.photos'
  | 'places.plusCode'
  | 'places.primaryType'
  | 'places.primaryTypeDisplayName'
  | 'places.shortFormattedAddress'
  | 'places.subDestinations'
  | 'places.types'
  | 'places.utcOffsetMinutes'
  | 'places.viewport';

type GooFieldMaskNearbyAdvanced =
  | 'places.currentOpeningHours'
  | 'places.currentSecondaryOpeningHours'
  | 'places.internationalPhoneNumber'
  | 'places.nationalPhoneNumber'
  | 'places.priceLevel'
  | 'places.rating'
  | 'places.regularOpeningHours'
  | 'places.regularSecondaryOpeningHours'
  | 'places.userRatingCount'
  | 'places.websiteUri';

type GooFieldMaskNearbyPreferred =
  | 'places.allowsDogs'
  | 'places.curbsidePickup'
  | 'places.delivery'
  | 'places.dineIn'
  | 'places.editorialSummary'
  | 'places.evChargeOptions'
  | 'places.fuelOptions'
  | 'places.goodForChildren'
  | 'places.goodForGroups'
  | 'places.goodForWatchingSports'
  | 'places.liveMusic'
  | 'places.menuForChildren'
  | 'places.parkingOptions'
  | 'places.paymentOptions'
  | 'places.outdoorSeating'
  | 'places.reservable'
  | 'places.restroom'
  | 'places.reviews'
  | 'places.servesBeer'
  | 'places.servesBreakfast'
  | 'places.servesBrunch'
  | 'places.servesCocktails'
  | 'places.servesCoffee'
  | 'places.servesDesserts'
  | 'places.servesDinner'
  | 'places.servesLunch'
  | 'places.servesVegetarianFood'
  | 'places.servesWine'
  | 'places.takeout';

type GooNearbyFieldMask =
  | GooFieldMaskNearbyBasic
  | GooFieldMaskNearbyAdvanced
  | GooFieldMaskNearbyPreferred
  | '*';
export { GooNearbyFieldMask };