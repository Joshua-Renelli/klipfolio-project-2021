import VisualizationsLoader from 'components/visualization-loader'
import { act } from "react-dom/test-utils";
import Spinner from 'components/spinner';
import DataCard from 'components/data-card';

import {mount} from 'enzyme'

const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};


beforeEach(() => {
  fetch.resetMocks();
});

it("Visualization loader renders 6 visualization components", async () => {
  fetch.mockResponseOnce(JSON.stringify({ visualizations: { CAD: 1.42 } }));

  const component = mount(
    <VisualizationsLoader/>,
  );

  expect(component.find(Spinner).length).toBe(1);

  await waitForComponentToPaint(component);

  expect(component.find(DataCard).length).toBe(6);

});

it("Visualization displays error text on API error response", async () => {
  fetch.mockReject(() => Promise.reject("API is down"));

  const component = mount(
    <VisualizationsLoader/>,
  );

  await waitForComponentToPaint(component);

  expect(component.text()).toEqual("Error loading visualizations");

  expect(fetch).toHaveBeenCalledWith(
    `http://localhost:3001/api/visualizations/6`
  );
});