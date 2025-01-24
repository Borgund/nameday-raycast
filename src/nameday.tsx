import { showToast, Toast, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useEffect } from "react";

type NameDayData = { name: string; day: number; month: number };

export default function Command() {
  const { isLoading, data, error } = useFetch<NameDayData[]>("https://nameday.borgund.dev/week");
  const {
    isLoading: allIsLoading,
    data: allData,
    error: allError,
  } = useFetch<NameDayData[]>("https://nameday.borgund.dev/");

  const todayData = data?.filter(({ day }) => day === new Date().getDate());
  const restData = data?.filter(({ day }) => day !== new Date().getDate());

  //Fetch further details from: "https://www.ssb.no/befolkning/navn/statistikk/navn/_/service/mimir/nameSearch?name=hans&includeGraphData=true",

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Step 1: Get today's date
  const dateFilter = new Date();
  dateFilter.setDate(dateFilter.getDate() + 7);
  const splitDate = dateFilter.getMonth() + 1 * 100 + dateFilter.getDate();

  // Step 2: Sort the array by date (month + day)
  const sortedByDate = allData?.sort((a, b) => {
    const aValue = a.month * 100 + a.day;
    const bValue = b.month * 100 + b.day;
    return aValue - bValue;
  });

  // Step 3: Find the index where today or the next date is in the list
  const splitIndex = sortedByDate?.findIndex((nd) => {
    const ndValue = nd.month * 100 + nd.day;
    return ndValue >= splitDate;
  });

  // Step 4: Split and reorder the array
  const reorderedNamedays = sortedByDate
    ? [...sortedByDate.slice(splitIndex), ...sortedByDate.slice(0, splitIndex)]
    : [];

  useEffect(() => {
    if (error || allError) {
      showToast({
        title: "Failed to fetch namedays",
        message: error?.message || allError?.message,
        style: Toast.Style.Failure,
      });
    }
  }, [error]);
  return (
    <List isLoading={isLoading} navigationTitle="Namedays" searchBarPlaceholder="Search for a name...">
      <List.Section title={`📆 Today's Namedays - ${days[new Date().getDay()]}`}>
        {todayData?.map(({ name }) => <List.Item key={name} title={name} accessories={[{ text: `Today! 🎉` }]} />)}
      </List.Section>
      <List.Section title="⏳ Close upcoming Namedays">
        {restData?.map(({ name, day, month }) => {
          const date = new Date(new Date().getFullYear(), month - 1, day);
          return (
            <List.Item key={name} title={name} accessories={[{ text: `${days[date.getDay()]} ${day}.${month}  📅` }]} />
          );
        })}
      </List.Section>
      {!allIsLoading && allData && (
        <List.Section title="🔍 All Namedays">
          {reorderedNamedays?.map?.(({ name, day, month }) => {
            return <List.Item key={name} title={name} accessories={[{ text: `${day}. ${months[month - 1]} 🗓️` }]} />;
          })}
        </List.Section>
      )}
    </List>
  );
}
