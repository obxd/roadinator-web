import mapList from "./mapList.json";


/*
 * Levenshtein Distance
 * --------------------------- */
class LevenshteinDistance{
  constructor(source ,traget)
  {
    this.s = source;
    this.t = traget;
    const n = this.s.length;
    const m = this.t.length;
    this.d = Array.from(Array(n + 1), () => new Array(m + 1));
    this.distance_calculated = false;
  }

  get_distance()
  {
    const  n = this.s.length;
    const m = this.t.length;
    if(this.distance_calculated) return this.d[n][m]
    if (n === 0) return m;
    if (m === 0) return n;

    for(let i = 0; i < n + 1; ++i)
      this.d[i][0] = i;

    for (let j = 0; j < m + 1; ++j)
      this.d[0][j] = j;
  
    for (let i = 1; i <= n; ++i) {
      for (let j = 1; j <= m; ++j) {
        let cost = (this.t[j-1] === this.s[i-1]) ? 0 : 1;
        this.d[i][j] = Math.min(
             this.d[i-1][j] + 1    // deletion
            ,this.d[i][j-1] + 1    // insertion
            ,this.d[i-1][j-1] + cost  // substitution
            );
      }
    }

    this.distance_calculated = true;
    return this.d[n][m];
  }

  get_ratio()
  {
    const n = this.s.length;
    const m = this.t.length;
    const distance = this.get_distance();
    
    if(n === 0 && m === 0 ) return 0;
    
    return (n + m - distance)/(n + m);
  }

  get_target_matches()
  {
    this.get_distance();

    let n = this.s.length;
    let m = this.t.length;
    let res = [];

    while(n > 0 && m > 0)
    {
      let smallest = Math.min( this.d[n-1][m]
                          ,this.d[n][m-1]
                          ,this.d[n-1][m-1]);

      if(this.d[n][m] === smallest) // match
      {
          res.push(m-1);
          --m;
          --n;
      }
      else if(this.d[n-1][m-1] === smallest) // substitusion
      {
          --n;
          --m;
      }
      else if(this.d[n-1][m] === smallest) // deletion
      {
          --n;
      }
      else if(this.d[n][m-1] === smallest) // insertion
      {
          --m;
      }
    }
    return res;
  }

}
// ---------------------------

/*
 * Priority Queue
 * --------------------------- */
class Heap {
	constructor(comparator) {
		this.size = 0;
		this.values = [];
		this.comparator = comparator;
	}

	add(val) {
		this.values.push(val);
		this.size ++;
    this.bubbleUp();
	}

	peek() {
		return this.values[0] || null;
	}

	poll() {
		const max = this.values[0];
		const end = this.values.pop();
		this.size --;
		if (this.values.length) {
			this.values[0] = end;
			this.bubbleDown();
		}
		return max;
	}

	bubbleUp() {
		let index = this.values.length - 1;
		let parent = Math.floor((index - 1) / 2);

		while ( parent !== -1 && this.comparator(this.values[index], this.values[parent]) < 0 ) {
			[this.values[parent], this.values[index]] = [this.values[index], this.values[parent]];
			index = parent;
			parent = Math.floor((index - 1) / 2);
		}
	}

	bubbleDown() {
		let index = 0, length = this.values.length;

		while (true) {
			let left = null,
				right = null,
				swap = null,
				leftIndex = index * 2 + 1,
				rightIndex = index * 2 + 2;

			if (leftIndex < length) {
				left = this.values[leftIndex];
				if (this.comparator(left, this.values[index]) < 0) swap = leftIndex;
			}

			if (rightIndex < length) {
				right = this.values[rightIndex];
				if ((swap !== null && this.comparator(right, left) < 0) || (swap === null && this.comparator(right, this.values[index]))) {
					swap = rightIndex;
				}
			}
			if (swap === null) break;

			[this.values[index], this.values[swap]] = [this.values[swap], this.values[index]];
			index = swap;
		}
	}
}

// ---------------------------
/** 
 *  Max Comparator
 */
const comparator = (a, b) => { 
  return b.score - a.score;
};
// ---------------------------

export default function filterMaps(searchText, maxResults) {
  const res = [];

  if( searchText.length > 2 && searchText.length < 50)
  {
    const Q = new Heap(comparator);
    for (let map of mapList)
    {
      let LD = new LevenshteinDistance(searchText, map.name);
      map.score = LD.get_ratio();
      map.matches = LD.get_target_matches();
      Q.add(map);
    }

    for(let i=0; i<maxResults; ++i)
    {
      if (Q.size === 0) break;
      let item = Q.peek();
      res.push(item);
      Q.poll();
    }
  }
  return res;
}
