import { useDispatch, useSelector } from 'react-redux';

import { AppDispatchType, AppRootStateType, AppSelectorType } from './store';


export const useAppDispatch = useDispatch<AppDispatchType>;
export const useAppSelector: AppSelectorType = useSelector<AppRootStateType>;
