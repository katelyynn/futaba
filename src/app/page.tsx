import { SakuraAlbumList } from "./_components/album/album";
import { SakuraGroup, SakuraGroupList } from "./_components/group/group";
import { AlbumsList } from "./home/albums";

export default function Home() {
  return (
    <>
      <SakuraGroupList>
        <SakuraGroup name="Most played">
          <AlbumsList order="DESC" sort="play_date" />
        </SakuraGroup>
        <SakuraGroup name="Recently added">
          <AlbumsList order="DESC" sort="recently_added" />
        </SakuraGroup>
        <SakuraGroup name="Recently released">
          <AlbumsList order="DESC" sort="max_year" />
        </SakuraGroup>
      </SakuraGroupList>
    </>
  );
}
