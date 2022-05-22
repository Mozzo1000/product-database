import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/v1/";


const addEnvironment = (product_id, carbon_footprint, 
                        carbon_deviation, weight_kg_assumption,
                        lifetime_year_assumption, use_location_assumption,
                        assembly_location_assumption, source, report_created, 
                        carbon_percentage_manufacturing, carbon_percentage_transportation,
                        carbon_percentage_eol, carbon_percentage_use, screen_size_assumption,
                        energy_demand_kwh_assumption) => {
  return axios.post(API_URL + "environments", {
    product_id,
    carbon_footprint,
    carbon_deviation,
    weight_kg_assumption,
    lifetime_year_assumption,
    use_location_assumption,
    assembly_location_assumption,
    source,
    report_created,
    carbon_percentage_manufacturing,
    carbon_percentage_transportation,
    carbon_percentage_eol,
    carbon_percentage_use,
    screen_size_assumption,
    energy_demand_kwh_assumption
  }, { headers: authHeader() });
};


const getEnvironment = (environment_id) => {
  return axios.get(API_URL + "environments/" + environment_id, {}, { headers: authHeader() });
};

const removeEnvironment = (environment_id) => {
  return axios.delete(API_URL + "environments/" + environment_id, {}, { headers: authHeader() });
};

const exportedObject = {
    getEnvironment,
    addEnvironment,
    removeEnvironment,
};

export default exportedObject;
