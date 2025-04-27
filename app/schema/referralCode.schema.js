import * as Yup from 'yup';

export const referralCodeSchema = Yup.object().shape({
  generateMethod: Yup.string()
    .required('Please select a generation method')
    .oneOf(['1', '2', '3'], 'Invalid generation method selected'),
});
