import React from 'react';
import ReactDOM from 'react-dom';
import DrugSteadyState from './DrugSteadyState';
import { render, fireEvent, cleanup } from 'react-testing-library';

let dosageInput;
let halfLifeInput;
let drugLevelsTableOuter;
let queryByTestId;
let getByText;
let getByTestId;
let container;
let queryAllByTestId;
let computeMoreDaysButton;
afterEach(cleanup)

beforeEach(()=>{
    let res = render(<DrugSteadyState />);
    queryByTestId = res.queryByTestId;
    getByTestId = res.getByTestId;
    getByText = res.getByText;
    queryAllByTestId = res.queryAllByTestId;
    dosageInput = getByTestId("dosage-input");
    halfLifeInput = getByTestId("half-life-input");
    computeMoreDaysButton = queryByTestId("more-days-button");
    drugLevelsTableOuter = queryByTestId("drug-level-table-outer");
})

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DrugSteadyState />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test("setting dosage does not cause drug levels to appear", ()=> {
    fireEvent.change(dosageInput, { target: { value: 5 }});
    expect(drugLevelsTableOuter).toBe(null);
});

test("setting halflife does not cause drug levels to appear", ()=> {
    fireEvent.change(halfLifeInput, { target: { value: 5 }});
    expect(drugLevelsTableOuter).toBe(null);
});

test("setting dosage and halflife causes drug levels to appear", ()=> {
    fireEvent.change(dosageInput, { target: { value: 5 }});
    fireEvent.change(halfLifeInput, { target: { value: 5 }});
    drugLevelsTableOuter = queryByTestId("drug-level-table-outer");
    expect(drugLevelsTableOuter).not.toBe(null);
});

test("resetting dosage invalid hides drug levels", ()=> {
    fireEvent.change(dosageInput, { target: { value: 5 }});
    fireEvent.change(halfLifeInput, { target: { value: 5 }});
    drugLevelsTableOuter = queryByTestId("drug-level-table-outer");
    expect(drugLevelsTableOuter).not.toBeNull();
    fireEvent.change(dosageInput, { target: { value: NaN }});
    drugLevelsTableOuter = queryByTestId("drug-level-table-outer");
    expect(drugLevelsTableOuter).toBeNull();
});

test("resetting halflife invalid hides drug levels", ()=> {
    fireEvent.change(dosageInput, { target: { value: 5 }});
    fireEvent.change(halfLifeInput, { target: { value: 5 }});
    drugLevelsTableOuter = queryByTestId("drug-level-table-outer");
    expect(drugLevelsTableOuter).not.toBeNull();
    fireEvent.change(halfLifeInput, { target: { value: NaN }});
    drugLevelsTableOuter = queryByTestId("drug-level-table-outer");
    expect(drugLevelsTableOuter).toBeNull();
});

test("after setting dosage and halflife, expect 20 days initially", ()=> {
    fireEvent.change(dosageInput, { target: { value: 5 }});
    fireEvent.change(halfLifeInput, { target: { value: 5 }});
    drugLevelsTableOuter = queryByTestId("drug-level-table-outer");
    let drugLevelDays = queryAllByTestId("drug-level-on-day");
    expect(drugLevelDays.length).toBe(20);
});

test("after pushing 'compute more days' button, shows 30 days", ()=> {
    fireEvent.change(dosageInput, { target: { value: 5 }});
    fireEvent.change(halfLifeInput, { target: { value: 5 }});
    computeMoreDaysButton = queryByTestId("more-days-button");
    fireEvent.click(computeMoreDaysButton);
    let drugLevelDays = queryAllByTestId("drug-level-on-day");
    expect(drugLevelDays.length).toBe(30);
});