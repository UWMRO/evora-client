//import { setFilter } from "../apiClient";

import { useEffect, useState } from 'react';
import { getFilterWheel, homeFilterWheel, setFilterWheel } from '../apiClient';
import BeatLoader from 'react-spinners/BeatLoader';

function FilterTypeSelector({ filterType, setFilterType }) {
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    setInterval(() => {
      getFilterWheel()
        .then((reply) => setFilterType(reply.filter))
        .catch((err) => console.log(err));
    }, 1000);
  }, [setFilterType]);

  const handleFilterChange = (filter) => {
    setMoving(true);
    setFilterWheel(filter)
      .then(() => {
        setMoving(false);
        setFilterType(filter);
      })
      .catch((err) => console.log(err));
  };

  const handleHome = () => {
    setMoving(true);
    homeFilterWheel()
      .then(() => setMoving(false))
      .catch((err) => console.log(err));
  };

  return (
    <fieldset disabled={moving} className="filter">
      <legend>Filters</legend>
      <label>
        Ha
        <input
          type="radio"
          name="FilterType"
          onChange={() => handleFilterChange('Ha')}
          value="Ha"
          checked={filterType === 'Ha'}
        />
      </label>
      <label>
        B
        <input
          type="radio"
          name="FilterType"
          onChange={() => handleFilterChange('B')}
          value="B"
          checked={filterType === 'B'}
        />
      </label>
      <label>
        V
        <input
          type="radio"
          name="FilterType"
          onChange={() => handleFilterChange('V')}
          value="V"
          checked={filterType === 'V'}
        />
      </label>
      <label>
        g
        <input
          type="radio"
          name="FilterType"
          onChange={() => handleFilterChange('g')}
          value="g"
          checked={filterType === 'g'}
        />
      </label>
      <label>
        r
        <input
          type="radio"
          name="FilterType"
          onChange={() => handleFilterChange('r')}
          value="r"
          checked={filterType === 'r'}
        />
      </label>
      <label>
        i
        <input
          type="radio"
          name="FilterType"
          onChange={() => handleFilterChange('i')}
          value="r"
          checked={filterType === 'i'}
        />
      </label>
      {!moving && <button onClick={handleHome}>Home</button>}
      {moving && (
        <label style={{ width: '200px' }}>
          <BeatLoader
            cssOverride={{ verticalAlign: 'middle', alignContent: 'end' }}
            color="red"
            size={12}
            loading={true}
            speedMultiplier={0.7}
          />
        </label>
      )}
    </fieldset>
  );
}

export default FilterTypeSelector;
