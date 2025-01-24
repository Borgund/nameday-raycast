import { Detail, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useEffect } from "react";

type SSBResponse = {
  id: string;
  count: number;
  name: string;
  type: string;
  gender: string;
  graphfile: string;
};
export default function DetailsView({ name }: { name: string }) {
  const validName = name.trim().toLowerCase();
  const { isLoading, data, error } = useFetch<{ response: { docs: [SSBResponse] } }>(
    `https://www.ssb.no/befolkning/navn/statistikk/navn/_/service/mimir/nameSearch?name=${validName}&includeGraphData=true`,
  );
  const docs = data?.response.docs;
  const firstgiven = docs?.filter((item) => item.type === "firstgiven");
  const maleCount = firstgiven?.filter((item) => item.gender === "M")[0].count;
  const femaleCount = firstgiven?.filter((item) => item.gender === "F")[0].count;
  const totalCount = (femaleCount ?? 0) + (maleCount ?? 0);
  const family = docs?.filter((item) => item.type === "family")[0];
  const isMale = maleCount ?? 0 > 0;
  const isFemale = femaleCount ?? 0 > 0;

  useEffect(() => {
    if (error) {
      showToast({
        title: `Failed to fetch information about ${name}`,
        message: error.message,
        style: Toast.Style.Failure,
      });
    }
  }, [error]);

  const graphMarkdown = firstgiven ? `![](https://www.ssb.no/${firstgiven.graphfile})` : "";

  return (
    <Detail
      isLoading={isLoading}
      markdown={`# Norwegian facts for ${name} 🔍🇳🇴 \n ${graphMarkdown}`}
      //markdown={`# lol \n ![](https://www.ssb.no/a/navn/guttermange/adrian.gif)`}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={`https://no.geneanet.org/fornavn/${name}`} />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Shares name with" text={`${totalCount}`} />
          {family && <Detail.Metadata.Label title="Used as a Family name by" text={`${family.count}`} />}
          <Detail.Metadata.TagList title="Gender">
            {isMale && <Detail.Metadata.TagList.Item text={`Male (${maleCount})`} color="cyan" />}
            {isFemale && <Detail.Metadata.TagList.Item text={`Female (${femaleCount})`} color="pink" />}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="More details"
            target={`https://no.geneanet.org/fornavn/${name}`}
            text={`${name}`}
          />
        </Detail.Metadata>
      }
    />
  );
}
