import { SakuraGroup, SakuraGroupList } from "../components/group/group.tsx";
import { AlbumsList } from "./home/albums.tsx";

export default function Home() {
  return (
    <>
      <SakuraGroupList>
        <SakuraGroup name="Jump back in">
          <AlbumsList order="DESC" sort="play_date" />
        </SakuraGroup>
        <SakuraGroup name="Recently released">
          <AlbumsList order="DESC" sort="date" />
        </SakuraGroup>
        <SakuraGroup name="Recently added">
          <AlbumsList order="DESC" sort="importedAt" />
        </SakuraGroup>
        <SakuraGroup name="Explore your library">
          <AlbumsList order="ASC" sort="random" />
        </SakuraGroup>
        <SakuraGroup name="Most played">
          <AlbumsList order="DESC" sort="play_count" />
        </SakuraGroup>
      </SakuraGroupList>
    </>
  );
}
