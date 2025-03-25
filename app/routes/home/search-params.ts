import {
  createLoader,
  createSerializer,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { getDays } from "./utils";

export const searchParamsMap = {
  day: parseAsStringEnum(getDays()).withDefault(getDays()[0]),
};

export const serialize = createSerializer(searchParamsMap);

export const loadSearchParams = createLoader(searchParamsMap);

export const useHomeSearchParams = () => useQueryStates(searchParamsMap);
