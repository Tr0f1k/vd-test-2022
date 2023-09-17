<template>
  <simple-card class="vd-form">
    <template #title>Autoverzekering vergelijken</template>

    <template #content>
      <!-- LicensePlate -->
      <div class="form-group">
        <label for="licensePlate">License Plate Number:</label>
        <input v-model="licensePlate" id="licensePlate" name="License Plate">
        <p v-if="licensePlateErrorMessage" class="error">{{ licensePlateErrorMessage }}</p>
      </div>
      <div>
        <p>Car Make: {{ carInfo.make }}</p>
        <p>Manufacturing Year: {{ carInfo.manufacturingYear }}</p>
      </div>
      <!-- Zipcode -->
      <div class="form-group">
        <label for="zipCode">Zip Code:</label>
        <input v-model="zipCode" id="zipCode" name="Zip Code">
        <p v-if="zipCodeErrorMessage" class="error">{{ zipCodeErrorMessage }}</p>
      </div>

      <!-- Housenumber -->
      <div class="form-group">
        <label for="houseNumber">House Number:</label>
        <input v-model="houseNumber" id="houseNumber" name="House Number">
        <p v-if="houseNumberErrorMessage" class="error">{{ houseNumberErrorMessage }}</p>
      </div>

      <!-- Housenumber addition -->
      <div class="form-group">
        <label for="houseNumberAddition">House Number Addition:</label>
        <input v-model="houseNumberAddition" id="houseNumberAddition" name="House Number Addition">
        <p v-if="houseNumberAdditionErrorMessage" class="error">{{ houseNumberAdditionErrorMessage }}</p>
      </div>

      <!-- birthdate -->
      <div class="form-group">
        <label for="birthDate">Birth Date</label>
        <input v-model="birthDate" id="birthDate" name="Birth Date" @input="updateClaimFreeYears">
        <p v-if="birthDateErrorMessage" class="error">{{ birthDateErrorMessage }}</p>
      </div>

      <!-- ClaimFree years -->
      <div class="form-group">
        <label for="claimFreeYears">ClaimFree Years:</label>
        <select v-model="claimFreeYears" id="claimFreeYears">
          <option v-for="year in claimFreeYearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

<!-- Kilometrage -->
<div class="form-group">
  <label for="kilometrage">Kilometrage:</label>
  <select v-model="kilometrage" id="kilometrage">
    <option value="0 t/m 7500 KM">0 t/m 7500 KM</option>
    <option value="7501 t/m 10000 KM">7501 t/m 10000 KM</option>
    <option value="10001 t/m 12000 KM">10001 t/m 12000 KM</option>
    <option value="12001 t/m 15000 KM">12001 t/m 15000 KM</option>
    <option value="15000 t/m 20000 KM">15000 t/m 20000 KM</option>
    <option value="20001 t/m 25000 KM">20001 t/m 25000 KM</option>
    <option value="25001 t/m 30000 KM">25001 t/m 30000 KM</option>
    <option value="30001 t/m 90000 KM">30001 t/m 90000 KM</option>
  </select>
</div>

      <div class="btn" @click="onSubmit">Vergelijken</div>


    </template>
  </simple-card>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import SimpleCard from './simpleCard.vue';
import axios from 'axios';
import moment from 'moment';

@Options({
  components: {
    SimpleCard,
  },
})

export default class CarForm extends Vue {
  data() {
    return {
      licensePlate: '',
      licensePlateErrorMessage: '',
      carInfo: {
        make: '',
        manufacturingYear: '',
      },
      zipCode: '',
      zipCodeErrorMessage: '',
      houseNumber: '',
      houseNumberErrorMessage: '',
      houseNumberAddition: '',
      houseNumberAdditionErrorMessage: '',
      birthDate: '',
      birthDateErrorMessage: '',
      claimFreeYears: 0,
      initialClaimFreeYearOptions: Array.from({ length: 6 }, (_, index) => -index).reverse(),
      claimFreeYearOptions: Array.from({ length: 6 }, (_, index) => -index).reverse(), //Array.from({ length: 6 }, (_, index) => -index),
      kilometrage: '7501 t/m 10000 KM',
    };
  }

  validateLicensePlate() {
    const licensePlatePattern = /^[A-Z0-9]{6}$/; // 6 characters, only capital letters and numbers
    if (!licensePlatePattern.test(this.licensePlate)) {
      this.licensePlateErrorMessage = 'License Plate format is incorrect. It should be 6 characters with capital letters and numbers.';
      return false;
    }
    return true;
  }

  validateZipCode() {
    const zipCodePattern = /^[0-9]{4}[A-Z]{2}$/;
    if (!zipCodePattern.test(this.zipCode)) {
      this.zipCodeErrorMessage = 'Zip Code format is incorrect. It should be 4 digits followed by 2 capital letters.';
      return false;
    }
    return true;
  }

  validateHouseNumber() {
    const houseNumberPattern = /^\d+$/;
    if (!houseNumberPattern.test(this.houseNumber)) {
      this.houseNumberErrorMessage = 'House Number should contain only digits.';
      return false;
    }
    return true;
  }

  validateHouseNumberAddition() {
    const houseNumberAdditionPattern = /^[A-Za-z0-9]*$/;
    if (!houseNumberAdditionPattern.test(this.houseNumberAddition.trim())) {
      this.houseNumberAdditionErrorMessage = 'House Number Addition should contain only letters and numbers.';
      return false;
    }
    this.houseNumberAdditionErrorMessage = ''; // Clear the error message if validation passes
    return true;
  }

  validateBirthDate() {
    this.birthDateErrorMessage = '';
    
    if (!this.birthDate) {
      this.birthDateErrorMessage = 'Birth Date is required';
      return false;
    }

    const dateFormat = 'DD-MM-YYYY';
    const parsedDate = moment(this.birthDate, dateFormat, true);

    if (!parsedDate.isValid()) {
      this.birthDateErrorMessage = 'Invalid date format. Please use DD-MM-YYYY.';
      return false;
    }

    const today = moment();
    const age = today.diff(parsedDate, 'years');

    if (age > 100) {
      this.birthDateErrorMessage = 'You cannot be more than 100 years old';
      return false;
    }

    return true;
  }

  updateClaimFreeYears() {
    if (moment(this.birthDate, 'DD-MM-YYYY', true).isValid()) {
      const birthYear = moment(this.birthDate, 'DD-MM-YYYY').year();
      const currentYear = moment().year();
      const legalAge = 18;
      const maxClaimFreeYears = currentYear - birthYear - legalAge;

      // Generate an array of claim free years
      const newOptions = Array.from({ length: maxClaimFreeYears + 1 }, (_, index) => index);
      newOptions.shift();
      this.claimFreeYearOptions = this.initialClaimFreeYearOptions.concat(newOptions);
      localStorage.setItem('claimFreeYears', this.claimFreeYears.toString());
    }
  }


  created() {
    // Check if query parameters exist in the URL and populate form fields
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('LicensePlate')) {
      this.licensePlate = queryParams.get('LicensePlate');
    }
    if (queryParams.has('ZipCode')) {
      this.zipCode = queryParams.get('ZipCode');
    }
    if (queryParams.has('HouseNumber')) {
      this.houseNumber = queryParams.get('HouseNumber');
    }
    if (queryParams.has('HouseNumberAddition')) {
      this.houseNumberAddition = queryParams.get('HouseNumberAddition');
    }
    if (queryParams.has('BirthDate')) {
      this.birthDate = queryParams.get('BirthDate');
    }
    const storedClaimFreeYears = localStorage.getItem('claimFreeYears');
  if (storedClaimFreeYears) {
    this.claimFreeYears = parseInt(storedClaimFreeYears, 10);
  } else {
    // If not found in localStorage, set it to 0 as the default
    this.claimFreeYears = 0;
  }
    if (queryParams.has('kilometrage')) {
      this.kilometrage = queryParams.get('kilometrage')
    }
    if (queryParams.has('make') && queryParams.has('manufacturingYear')) {
    // Populate carInfo with values from query parameters
    this.carInfo = {
      make: queryParams.get('make'),
      manufacturingYear: queryParams.get('manufacturingYear'),
    };
  }
    this.updateClaimFreeYears();
  }

    async onSubmit() {
    this.updateClaimFreeYears();
          // Reset error messages
    this.licensePlateErrorMessage = '';
    this.zipCodeErrorMessage = '';
    this.houseNumberErrorMessage = '';
    this.houseNumberAdditionErrorMessage = '';
    this.birthDateErrorMessage = '';

    // Validate fields
    const isValidLicensePlate = this.validateLicensePlate();
    const isValidZipCode = this.validateZipCode();
    const isValidHouseNumber = this.validateHouseNumber();
    const isValidHouseNumberAddition = this.validateHouseNumberAddition();
    const isValidBirthDate = this.validateBirthDate();

        // If there are any validation errors, stop submission
        if (!isValidLicensePlate || !isValidZipCode || !isValidHouseNumber || !isValidHouseNumberAddition || !isValidBirthDate) {
      return;
    }

try {
  // Make the API request using Axios
  const response = await axios.get(
    `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${this.licensePlate}`
  );

  // Check if the response contains data
  if (response.data.length > 0) {
    // Extract car make and manufacturing year from the response
    const manufacturingYearFull = response.data[0].datum_eerste_toelating;
    
    // Extract the first 4 digits
    const manufacturingYear = manufacturingYearFull.substring(0, 4);

    this.carInfo = {
      ...this.carInfo,
      make: response.data[0].merk,
      manufacturingYear: manufacturingYear, // Use the extracted year
    };
  } else {
    this.licensePlateErrorMessage = 'Car not found for the provided license plate.';
    this.carInfo = null;
  }
} catch (error) {
  console.error('Error fetching data:', error);
  this.licensePlateErrorMessage = 'An error occurred while fetching data.';
  this.carInfo = null;
}
      // Construct the query string
  const queryParams = new URLSearchParams();
  queryParams.append('LicensePlate', this.licensePlate);
  queryParams.append('ZipCode', this.zipCode);
  queryParams.append('HouseNumber', this.houseNumber);
  queryParams.append('HouseNumberAddition', this.houseNumberAddition);
  queryParams.append('BirthDate', this.birthDate);
  queryParams.append('ClaimFreeYears', this.claimFreeYears);
  queryParams.append('kilometrage', this.kilometrage);
  /*queryParams.append('carMake', this.carInfo.make);
  queryParams.append('manufacturingYear', this.carInfo.manufacturingYear);*/
  if (this.carInfo) {
    queryParams.append('make', this.carInfo.make);
    queryParams.append('manufacturingYear', this.carInfo.manufacturingYear);
  }
  // Redirect to the URL with query parameters
  const baseUrl = 'http://192.168.178.101:8080/'; // Replace with your base URL
  const urlWithParams = `${baseUrl}?${queryParams.toString()}`;

  // You can redirect the user to the new URL using window.location.href
  window.location.href = urlWithParams;
  }
}
</script>

<style scoped>
  .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  font-weight: bold;
}

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 4px;
} 
   .vd-form {
        width: 330px;
    }

    @media only screen and (max-width: 768px) {
        .vd-form {
            width: 100%;
        }
    }

    .btn {
        background: #0cbe3b;
        text-align: center;
        padding: 10px 10px;
        font-weight: 600;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: .1s ease;
    }

    .btn:hover {
        background: #0ed642;
    }
</style>
