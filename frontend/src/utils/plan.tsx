import axios from 'axios';

const ROOT = '/api/plans';

type CreateRequestBody = {
  user_ids?: Array<string | number | undefined> | null;
  start_date?: Date;
  end_date?: Date;
  places?: Array<string>;
};

export type Hotel = {
  id: string | number;
  google_place_id?: string;
  check_in?: Date;
  check_out?: Date;
  confirmation_id?: string;
  note?: string;
};

export type Flight = {
  id: string | number;
  flight_number?: string;
  airline?: string;
  depart_date?: Date;
  has_depart_time?: boolean;
  depart_airport?: string;
  arrive_date?: Date;
  has_arrive_time?: boolean;
  arrive_airport?: string;
  confirmation_id?: string;
  note?: string;
};

type UpdateRequestBody = CreateRequestBody & {
  title?: string;
  is_public?: boolean;
  notes?: string;
  hotels_attributes?: Hotel;
  flights_attributes?: Flight;
};

type UpdatePlanProps = {
  body: UpdateRequestBody;
  id: string | number;
};

export const getPlan = async (id: string | number) => {
  return await axios.get(`${ROOT}/${id}`);
};

export const createPlan = async (body: CreateRequestBody) => {
  return await axios.post(ROOT, {
    plan: body,
  });
};

export const updatePlan = async ({ body, id }: UpdatePlanProps) => {
  return axios.patch(`${ROOT}/${id}`, { plan: body });
};
