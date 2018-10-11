import { utils } from '../utilities';

export type TNdNum = number|INdArray;
interface INdArray extends Array<TNdNum> {
  [key: number]: TNdNum;
}




// export type NdValue = NdArray;
// export type NdArray = any;


// const x: NdArray = [1, 2, [3, [4, [5, [6, [7, [8]]]]]]];


export const newArray = <T>(length: number, initialValue: T): T[] =>
  Array.apply(null, Array(length)).fill( initialValue );

export const seq = (length: number, begin = 0, step = 1 ): number[] =>
  newArray( length, 0 ).map( (_, i) => i * step + begin );

export const arange = seq;


export const createNdArray = (shape: number[], initialValue: number = 0 ): TNdNum => {
  if ( !shape || shape.length < 1 ) return initialValue;
  const array1 = newArray( shape[0], 0 );
  if ( shape.length === 1 ) {
    return array1.map( _ => initialValue );
  } else {
    return array1.map( _ => createNdArray( shape.slice(1), initialValue ) );
  }
};

export const deepCopy = (x: TNdNum): TNdNum => {
  if ( typeof x === 'number' ) return x;
  if ( dim(x) === 1 ) {
    return (x as number[]).slice();
  } else {
    return x.map( line => deepCopy( line ) );
  }
};

export const dim = (x: TNdNum): number => {
  if ( !x || typeof x === 'number' ) {
    return 0;
  } else {
    return 1 + dim( x[0] );
  }
};


export const shapeOf = (x: TNdNum): number[] => {
  if ( !x || typeof x === 'number' ) {
    return [];
  } else {
    return [x.length, ...shapeOf( x[0] )];
  }
};

export const isSameShape = (x: TNdNum, y: TNdNum): boolean => {
  const xShape = shapeOf(x);
  const yShape = shapeOf(y);
  return xShape.every( (e, i) => e === yShape[i] );
};

export const nofElements = (x: TNdNum): number =>
  shapeOf(x).reduce( (a, b) => a * b, 1 );
//   if ( !x || typeof x === 'number' ) return 1;
//   if ( dim(x) === 1 ) return x.length;
//   return x.reduce<number>( (acc: number, small_x: TNdNum) => acc + nofElements(small_x), 0 );
// };

export const at = (x: TNdNum, pos: number[]): number => {
  if ( typeof x === 'number' ) return x;
  if ( dim(x) !== pos.length ) throw new Error('dim(x) and pos.length does not match');
  return at( x[ pos[0] ], pos.slice(1) );
};

export const set = (x: TNdNum, pos: number[], value: number): void => {
  if ( !x || typeof x === 'number' ) return;
  if ( dim(x) === 1 ) {
    x[ pos[0] ] = value;
  } else {
    set( x[ pos[0] ], pos.slice(1), value );
  }
};

export const map = ( x: TNdNum, f: (e: number) => number ): TNdNum => {
  if ( typeof x === 'number' ) return f(x);
  if ( dim(x) === 1 ) {
    return (x as number[]).map( e => f(e) );
  } else {
    return x.map( line => map( line, f ) );
  }
};

export const updateValue = ( x: TNdNum, f: (e: number) => number ): void => {
  if ( typeof x === 'number' ) return;
  if ( dim(x) === 1 ) {
    (x as number[]).forEach( (e, i) => x[i] = f(e) );
  } else {
    x.map( line => updateValue( line, f ) );
  }
};





const flatten_sub = (x: TNdNum, acc: number[]): void => {
  if ( typeof x === 'number' ) {
    acc.push(x);
  } else if ( dim(x) === 1 ) {
    Array.prototype.push.apply( acc, x );
  } else {
    x.forEach( e => flatten_sub( e, acc ) );
  }
};

export const flatten = (x: TNdNum): number[] => {
  const acc: number[] = [];
  flatten_sub(x, acc);
  return acc;
};



const reshape_sub = (from: number[], to: TNdNum): void => {
  if ( !to || typeof to === 'number' ) return;
  if ( dim(to) === 1 ) {
    to.forEach( (_, i) => to[i] = from[i] );
  } else {
    const n = nofElements( to[0] );
    reshape_sub( from, to[0] );
    reshape_sub( from.slice(n), to.slice(1) );
  }
};

export const reshape = (x: TNdNum, shape: number[]): TNdNum => {
  // console.log('reshape', x, shape);
  if ( typeof x === 'number' ) return x;

  const x_1d = flatten(x);
  const shape_full = shape.slice();

  const blankIndex = shape_full.findIndex( e => e === -1 );
  if ( blankIndex !== -1 ) {
    shape_full[ blankIndex ]
      = nofElements(x) / (shape_full.filter( e => e !== -1 )
                                    .reduce( (a, v) => a * v, 1 ) );
    if ( !utils.number.isInt( shape_full[ blankIndex ] ) ) throw new Error('invalid value in shape (must be integer)');
  }
  const result = zeros( shape_full );
  reshape_sub( x_1d, result );
  return result;
};



export const slice = (
  x: TNdNum,
  range: {
    begin?:  number,
    end?:    number,
    stride?: number,
  }[],
): TNdNum => {
  if ( typeof x === 'number' ) return x;
  if ( dim(x) !== range.length ) throw new Error('range length does not match');

  const range0_cmpl = {
    begin:  range[0].begin  || 0,
    end:    range[0].end    || undefined,
    stride: range[0].stride || 1,
  };

  if ( dim(x) === 1 ) {
    return x.slice( range0_cmpl.begin, range0_cmpl.end )
            .filter( (_, i) => i % range0_cmpl.stride === 0 );
  } else {
    return x.slice( range0_cmpl.begin, range0_cmpl.end )
            .filter( (_, i) => i % range0_cmpl.stride === 0 )
            .map( line => slice( line, range.slice(1) ) );
  }
};



const transpose_sub = (
  from: TNdNum,
  to: TNdNum,
  tr: number[],
  pos: number[],
): void => {
  if ( typeof from === 'number' ) return;
  if ( dim(from) === 1 ) {
    (from as number[]).forEach( (e: number, i) => {
      const pos2 = [...pos, i];
      set( to, tr.map( j => pos2[j] ), e );
    } );
  } else {
    from.forEach( (_, i) => {
      transpose_sub( from[i], to, tr, [...pos, i] );
    } );
  }
};

export const transpose = (x: TNdNum, tr: number[]) => {
  if ( typeof x === 'number' ) return x;
  if ( dim(x) !== tr.length ) throw new Error('dim(x) and tr.length does not match');

  const result = zeros( tr.map( i => shapeOf(x)[i] ) );
  transpose_sub( x, result, tr, [] );
  return result;
};






// 演算

export const zeros = (size: number[]): TNdNum => createNdArray( size, 0 );
export const ones = (size: number[]): TNdNum => createNdArray( size, 1 );


export const exp = (x: TNdNum): TNdNum => {
  if ( typeof x === 'number' ) return Math.exp(x);
  return x.map( e => exp(e) );
};



export const add = (x: TNdNum, y: TNdNum): TNdNum => {
  if ( typeof x === 'number' || typeof y === 'number' ) {
    if ( typeof x === 'number' && typeof y === 'number' ) {
      return x + y;
    } else {
      throw new Error('type does not match');
    }
  }

  if ( !isSameShape(x, y) ) throw new Error('shape does not match');
  if ( dim(x) === 1 ) {
    return (x as number[]).map( (e, i) => e + (y as number[])[i] );
  } else {
    return x.map( (line, i) => add(line, y[i]) );
  }
};


export const sub = (x: TNdNum, y: TNdNum): TNdNum => {
  if ( typeof x === 'number' || typeof y === 'number' ) {
    if ( typeof x === 'number' && typeof y === 'number' ) {
      return x - y;
    } else {
      throw new Error('type does not match');
    }
  }

  if ( !isSameShape(x, y) ) throw new Error('shape does not match');
  if ( dim(x) === 1 ) {
    return (x as number[]).map( (e, i) => e - (y as number[])[i] );
  } else {
    return x.map( (line, i) => sub(line, y[i]) );
  }
};


export const mul = (x: TNdNum, y: TNdNum): TNdNum => {
  if ( typeof x === 'number' || typeof y === 'number' ) {
    if ( typeof x === 'number' && typeof y === 'number' ) {
      return x * y;
    } else {
      throw new Error('type does not match');
    }
  }

  if ( !isSameShape(x, y) ) throw new Error('shape does not match');
  if ( dim(x) === 1 ) {
    return (x as number[]).map( (e, i) => e * (y as number[])[i] );
  } else {
    return x.map( (line, i) => mul(line, y[i]) );
  }
};


export const div = (x: TNdNum, y: TNdNum): TNdNum => {
  if ( typeof x === 'number' || typeof y === 'number' ) {
    if ( typeof x === 'number' && typeof y === 'number' ) {
      return x / y;
    } else {
      throw new Error('type does not match');
    }
  }

  if ( !isSameShape(x, y) ) throw new Error('shape does not match');
  if ( dim(x) === 1 ) {
    return (x as number[]).map( (e, i) => e / (y as number[])[i] );
  } else {
    return x.map( (line, i) => div(line, y[i]) );
  }
};



const matrixProduct = (x: number[][], y: number[][]): number[][] => {
  const [shape_x0, shape_x1] = shapeOf(x);
  const [shape_y0, shape_y1] = shapeOf(y);
  const result = createNdArray( [ shape_x0, shape_y1 ], 0 ) as number[][];
  for ( let i = 0; i < shape_x0; ++i ) {
    for ( let j = 0; j < shape_y1; ++j ) {
      for ( let k = 0; k < shape_x1; ++k ) {
        result[i][j] += x[i][k] * y[k][j];
      }
    }
  }
  return result;
};

export const dot = (x: TNdNum, y: TNdNum): TNdNum => {
  const dim_x = dim(x);
  const dim_y = dim(y);
  const [shape_x0, shape_x1] = shapeOf(x);
  const [shape_y0, shape_y1] = shapeOf(y);
  if ( dim_x === 2 && dim_y === 2 && shape_x1 === shape_y0 ) {
    // matrix/matrix
    return matrixProduct( x as number[][], y as number[][] );
  } else if ( dim_x === 1 && dim_y === 2 && shape_x0 === shape_y0 ) {
    // vector/matrix
    return matrixProduct( [x as number[]], y as number[][] )[0];
  } else if ( dim_x === 2 && dim_y === 1 && shape_x1 === shape_y0 ) {
    // matrix/vector
    return matrixProduct( x as number[][], (y as number[]).map( e => [e]) )
            .map( e => e[0] );
  } else if ( dim_x === 1 && dim_y === 1 && shape_x0 === shape_y0 ) {
    // vector/vector
    return matrixProduct( [x as number[]], (y as number[]).map( e => [e]) )[0][0];
  } else {
    throw new Error('cannot compute the matrix product of given arrays');
  }
};



const shrinkToMaxValue = (x: TNdNum): TNdNum => {
  if ( typeof x === 'number' ) return x;
  if ( dim(x) === 1 ) {
    return Math.max( ...(x as number[]) );
  } else {
    return x.map( e => shrinkToMaxValue(e) );
  }
};

export const max = (x: TNdNum, axis?: number): number|TNdNum => {
  if ( typeof x === 'number' ) return x;
  if ( axis === undefined ) {
    if ( dim(x) === 1 ) return Math.max( ...(x as number[]) );
    return Math.max( ...(x.map( e => max(e) ) as number[]) );
  } else  {
    // maxを取ってつぶしたい軸を末尾にずらしてmaxを取り元に戻す
    const tr = newArray( dim(x), 0 ).map( (_, i) => i );
    tr.splice( axis, 1 );  // [0, 1, 2] -> [1, 2]
    tr.push( axis );  // [1, 2] -> [1, 2, 0]
    let result = transpose( x, tr );
    result = shrinkToMaxValue( result );
    return result;
  }
};



const shrinkToSum = (x: TNdNum): TNdNum => {
  if ( typeof x === 'number' ) return x;
  if ( dim(x) === 1 ) {
    return (x as number[]).reduce( (a, b) => a + b, 0 );
  } else {
    return x.map( e => shrinkToSum(e) );
  }
};

export const sum = (x: TNdNum, axis?: number): number|TNdNum => {
  if ( typeof x === 'number' ) return x;
  if ( axis === undefined ) {
    if ( dim(x) === 1 ) return (x as number[]).reduce( (a, b) => a + b, 0 );
    return (x.map( e => sum(e) ) as number[]).reduce( (a, b) => a + b, 0 );
  } else  {
    // sumを取ってつぶしたい軸を末尾にずらしてsumを取り元に戻す
    const tr = newArray( dim(x), 0 ).map( (_, i) => i );
    tr.splice( axis, 1 );  // [0, 1, 2] -> [1, 2]
    tr.push( axis );  // [1, 2] -> [1, 2, 0]
    let result = transpose( x, tr );
    result = shrinkToSum( result );
    return result;
  }
};


export const random = {
  randn: (shape: number[]): TNdNum => {
    const result = createNdArray( shape );
    updateValue( result, () => utils.number.random.randn() );
    return result;
  },

};

export const round = (x: TNdNum, precision: number): TNdNum =>
  map( x, e => utils.number.roundAt( e, precision ) );

