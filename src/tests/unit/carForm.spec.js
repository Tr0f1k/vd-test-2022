import { mount } from '@vue/test-utils';
import CarForm from '@/components/forms/carForm.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('CarForm', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('renders without errors', () => {
    const wrapper = mount(CarForm);
    expect(wrapper.exists()).toBe(true);
  });

  it('validates license plate input', () => {
    const wrapper = mount(CarForm);
    wrapper.setData({ licensePlate: 'ABC123' });
    wrapper.vm.validateLicensePlate();
    expect(wrapper.vm.licensePlateErrorMessage).toBe('');
  });

  it('fetches car info from the API', async () => {
    const responseData = [{ merk: 'Toyota', datum_eerste_toelating: '2000-01-01' }];
    mock.onGet(/https:\/\/opendata\.rdw\.nl/).reply(200, responseData);

    const wrapper = mount(CarForm);
    wrapper.setData({ licensePlate: 'ABC123' });
    await wrapper.vm.onSubmit();

    expect(wrapper.vm.carInfo.make).toBe('Toyota');
    expect(wrapper.vm.carInfo.manufacturingYear).toBe('2000');
  });

  it('updates claim free years based on birthdate', () => {
    const wrapper = mount(CarForm);
    wrapper.setData({ birthDate: '01-01-1990' });
    wrapper.vm.updateClaimFreeYears();
    expect(wrapper.vm.claimFreeYearOptions).toEqual([30, 31, 32, 33, 34, 35]);
  });

  it('submits the form and redirects', async () => {
    const wrapper = mount(CarForm);
    wrapper.setData({ licensePlate: 'ABC123' });
    const beforeRedirect = window.location.href;

    await wrapper.vm.onSubmit();

    // Check if the redirection URL has changed
    expect(window.location.href).not.toBe(beforeRedirect);
  });

  it('matches snapshot', () => {
    const wrapper = mount(CarForm);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
