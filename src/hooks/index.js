// This hook is used for titel display on browser head.
export { useTitle } from "./public/useTitle";
// This hepl to get the group name fromthe system.
export { useLoggersPlantsGroup } from "./public/useLoggersPlantsGroup";



// This is use for defult dispaly of data of solar and also help to filter
export { useMonthlyData } from "./solarData/useMonthlyData";
// This help to get the notification for solar data.
export { useNotification } from "./solarData/useNotification";


//Thsi help to reflect the existing plants in the system.
export { usePlantDetails } from "./home/usePlantDetails";



// This help to update the existing data for solar data
export { useIndivisualPowerGen } from "./addUpdate/useIndivisualPowerGen";
// This help to add the existing data for solar data
export { useAddPowerGen } from "./addUpdate/useAddPowerGen";
export { useIndivisualUtilityData } from "./addUpdate/useIndivisualUtilityData";
export { useAddMonthlyRevenues } from "./addUpdate/useAddMonthlyRevenues";
export { useAddMonthlyExpenses } from "./addUpdate/useAddMonthlyExpenses";



// This is use for defult dispaly of data of solar and also help to filter
export { useUtilityData } from "./utilityData/useUtilityData";
export { usePlantList } from "./utilityData/usePlantList";


// This is use for defult dispaly of data of cutailment and also help to filter
export { useMonthlyCutalData } from "./cutailment/useMonthlyCutalData";
export { useCurtailmentAddData } from './cutailment/useCurtailmentAddData';
export { useCurtailmentUpdateData } from './cutailment/useCurtailmentUpdateData';
export { usePlantCurtailmentEvents } from './cutailment/usePlantCurtailmentEvents';



//For system list and add 

export {useEditData } from './listAdd/useEditData';
export {useAddData } from './listAdd/useAddData';


export {useGisList} from './weatherData/useGisList';
export {useGetGisData} from './weatherData/useGetGisData';
