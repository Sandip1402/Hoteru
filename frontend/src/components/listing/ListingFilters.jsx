import { useEffect, useState } from "react";

import { CheckFilter } from "./CheckFilter.jsx";
import { RangeFilter } from "./RangeFilter.jsx";
import { BubbleFilter } from "./BubbleFilter.jsx";

import { useListingService } from "../../hooks/useListingService.js";

export const ListingFilters = ({
  type,
  price,
  amenities,
  rating,
  setType,
  setPrice,
  setAmenities,
  setRating
}) => {
  const { getAmenities } = useListingService();

  const [amenityOptions, setAmenityOptions] = useState([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(true);

  console.log(type, price, amenities, rating);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAmenities = async () => {
      try {
        const response = await getAmenities(controller.signal);

        const options = response.data.map((amenity) => ({
          value: amenity.amenityId,
          label: amenity.name,
        }));

        setAmenityOptions(options);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch amenities:", error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingAmenities(false);
        }
      }
    };

    fetchAmenities();

    return () => controller.abort();
  }, []);

  return (
    <aside className="w-full rounded-xl border border-border bg-white p-3">
      <div className="mb-2 px-3 py-2">
        <h2 className="text-base font-semibold text-text">
          Filters
        </h2>

        <p className="mt-1 text-xs text-text-muted">
          Refine your search
        </p>
      </div>

      {/* Property Type */}
      <BubbleFilter
        name="Property type"
        options={[
          { value: "HOTEL", label: "Hotel" },
          { value: "RESORT", label: "Resort" },
          { value: "HOSTEL", label: "Hostel" },
          { value: "VILLA", label: "Villa" },
          { value: "APARTMENT", label: "Apartment" },
        ]}
        value={type}
        onChange={setType}
      />

      {/* Amenities */}
      {!isLoadingAmenities && (
        <BubbleFilter
          name="Amenities"
          options={amenityOptions}
          value={amenities}
          onChange={setAmenities}
          multiple
        />
      )}

      {/* Price */}
      <RangeFilter
        name="Price"
        minVal={500}
        maxVal={10000}
        value={price}
        onChange={setPrice}
      />

      {/* Guest Rating */}
      <CheckFilter
        name="Guest rating"
        options={["4+", "4.5+", "5"]}
        value={rating}
        onChange={setRating}
      />
    </aside>
  );
};