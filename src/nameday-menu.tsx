import { Icon, MenuBarExtra } from "@raycast/api";
import { NameDayData } from "./types";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const { isLoading, data, error } = useFetch<NameDayData[]>("https://nameday.borgund.dev/today");
  const names = data?.map((name) => name.name).join(", ");
  return !error && <MenuBarExtra isLoading={isLoading} icon={Icon.Calendar} title={`${names}`} />;
}
