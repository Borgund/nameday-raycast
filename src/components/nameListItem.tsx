import { Action, ActionPanel, Icon, List } from "@raycast/api";
import DetailsView from "../nameday-details";

export const NameListItem = ({ name, accessoriesText }: { name: string; accessoriesText: string }) => {
  return (
    <List.Item
      key={name}
      title={name}
      accessories={[{ text: accessoriesText }]}
      actions={
        <ActionPanel title="Actions">
          <Action.Push title="Show Details" icon={Icon.MagnifyingGlass} target={<DetailsView name={name} />} />
        </ActionPanel>
      }
    />
  );
};
