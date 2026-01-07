import { from, map } from 'rxjs';

from(['a', 'b', 'c', 'd', 'e', 'f'])
  .pipe(
    map((s) => {
      const i = parseInt(s, 16);
      return `${i % 2 === 0 ? 'even' : 'odd'}: ${s} (${i})`;
    })
  )
  .subscribe((x) => console.log(x));
