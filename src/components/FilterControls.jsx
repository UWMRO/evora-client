//import { setFilter } from "../apiClient";

function FilterTypeSelector({filterType, setFilterType}) {

    function GetFilterTypeClicked(e) {
        setFilterType(e.target.value)
        console.log(e.target.value)
        //const filt = setFilter(e.target.value)
        //console.log(filt)
    }

    return (
      <fieldset> 
          <legend>
              Filters
          </legend>
          <label> Ha
              <input type='radio' name='FilterType' onChange={GetFilterTypeClicked} value='Ha'
              checked={
                filterType === 'Ha'
              }/>
          </label>
          <label> B
              <input type='radio' name='FilterType' onChange={GetFilterTypeClicked} value='B'
              checked={
                filterType === 'B'
              }/>
          </label>
          <label> V
              <input type='radio' name='FilterType' onChange={GetFilterTypeClicked} value='V'
              checked={
                filterType === 'V'
              }/>
          </label>
          <label> g
              <input type='radio' name='FilterType' onChange={GetFilterTypeClicked} value='g'
              checked={
                filterType === 'g'
              }/>
          </label>
          <label> r
              <input type='radio' name='FilterType' onChange={GetFilterTypeClicked} value='r'
              checked={
                filterType === 'r'
              }/>
          </label>
      </fieldset>
    );
  }
  
  
  
  export default FilterTypeSelector;