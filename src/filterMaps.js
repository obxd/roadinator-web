import mapList from "./mapList.json";
import { Fzf } from 'fzf';

const MIN_INPUT_SIZE = 1;
const MAX_INPUT_SIZE = 50;

const fzf = new Fzf(mapList, {
  selector: (item) => item.name,
});


export default function filterMaps(searchText, maxResults) {
  const res = [];

  if( searchText.length >= MIN_INPUT_SIZE && searchText.length <= MAX_INPUT_SIZE)
  {
    const entries = fzf.find(searchText.toLowerCase()).splice(0,maxResults);

    entries.forEach(entry => {
      let item = entry.item;
      item.matches = entry.positions;
      res.push(item);
    })
  }

  return res;
}
