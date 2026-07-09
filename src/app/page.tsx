import { SakuraAlbumList } from "./_components/album/album";
import { SakuraGroup, SakuraGroupList } from "./_components/group/group";
import { AlbumsList } from "./home/albums";

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
          <AlbumsList order="DESC" sort="recently_added" />
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
