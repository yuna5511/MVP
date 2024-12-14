import { useRef, useState } from 'react';
import { Plan } from '../../types/api';
import { useFormattedDays } from '../../hooks/useFormattedDays';
import Datepicker from 'react-tailwindcss-datepicker';

type Props = {
  plan: Plan;
};

const PlanLayout = ({ plan }: Props) => {
  const overviewRef = useRef(null);
  const notesRef = useRef(null);
  const placesRef = useRef(null);
  const flightsRef = useRef(null);
  const hotelsRef = useRef(null);
  const itineraryRef = useRef(null);
  const [showSideMenu, setShowSideMenu] = useState(true);

  const handleScroll = (ref: any) => {
    if (ref && ref?.current) {
      ref.current.scrollIntoView();
    }
  };
  // TODO: 予算セクション

  const formattedDays = useFormattedDays(plan.itinerary?.days);
  const toggleSideMenu = () => setShowSideMenu((prevState) => !prevState);

  // TODO:一時的な解決策
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_EMBED_KEY;
  const placeId =
    plan.places.length > 0
      ? `place_id:${plan.places[0].google_place_id}`
      : 'Japan';
  const googleEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${placeId}&zoom=17`;

  return (
    <>
      <div className={`drawer ${showSideMenu ? 'drawer-open' : ''} h-full`}>
        <input
          id="my-drawer-expanded"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex w-full h-full">
          <ul
            className={`menu bg-base-200 min-h-full p-4 fixed left-0 top-[64px] ${!showSideMenu ? 'opacity-100' : 'opacity-0'} transition-opacity ease-in-out delay-150 duration-300`}
          >
            <li onClick={() => handleScroll(overviewRef)}>
              <a className="tooltip tooltip-right" data-tip="概要">
                <span className="material-icons">luggage</span>
              </a>
            </li>
            <li onClick={() => handleScroll(itineraryRef)}>
              <a className="tooltip tooltip-right" data-tip="旅程">
                <span className="material-icons">calendar_month</span>
              </a>
            </li>
            <button
              className="btn btn-ghost fixed bottom-0"
              onClick={toggleSideMenu}
            >
              <span className="material-icons">
                keyboard_double_arrow_right
              </span>
            </button>
          </ul>
          <div
            className={`flex flex-col ${!showSideMenu ? 'ml-[88px]' : ''} items-center min-w-[480px] w-3/5 px-14 py-9`}
          >
            <div
              ref={overviewRef}
              className="card bg-base-100 w-4/5 max-w-[560px] shadow-lg h-44"
            >
              <div className="card-body flex flex-col justify-between px-6 py-5">
                <input
                  type="text"
                  placeholder="旅行名を入力してください"
                  className="input w-full font-bold text-3xl"
                  value={plan.title}
                />
                <div className="flex justify-between">
                  <div>
                    <Datepicker
                      i18n={'ja'}
                      value={{
                        startDate: new Date(plan.itinerary.startDate),
                        endDate: new Date(plan.itinerary.endDate),
                      }}
                      onChange={(newDateRange) => console.log(newDateRange)}
                      popoverDirection="down"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 mt-8 w-full items-center">
              <div className="card bg-base-200 w-fit">
                <div className="card-body flex flex-col items-center px-6 py-5">
                  <h2 className="font-semibold text-lg mb-4">予約</h2>
                  <div className="flex justify-between">
                    <button className="flex flex-col btn btn-square btn-ghost text-sm h-[60px]">
                      <span className="material-icons">flight</span>
                      <span className="text-[10px]">フライト</span>
                    </button>
                    <div className="divider lg:divider-horizontal"></div>
                    <button className="flex flex-col btn btn-square btn-ghost text-sm h-[60px]">
                      <span className="material-icons">hotel</span>
                      <span className="text-[10px]">宿泊</span>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col w-full max-w-[640px]"
                ref={notesRef}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button className="btn btn-square btn-sm btn-ghost p-0">
                      <span className="material-icons">
                        keyboard_arrow_down
                      </span>
                    </button>
                    <h1 className="font-bold text-2xl">注記</h1>
                  </div>
                  <button className="btn btn-square btn-sm btn-ghost">
                    <span className="material-icons">delete</span>
                  </button>
                </div>
                <div className="card bg-base-200 w-full">
                  <div className="card-body p-2">
                    <textarea
                      className="textarea textarea-ghost w-full"
                      placeholder="ここに何でも書き込んでください。"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <iframe width="100%" height="100%" src={googleEmbedUrl}></iframe>
          </div>
        </div>
        <div className="drawer-side h-full w-[200px]">
          <label
            htmlFor="my-drawer-expanded"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full p-4">
            <li>
              <details open>
                <summary
                  className="font-semibold text-xl"
                  onClick={() => handleScroll(overviewRef)}
                >
                  概要
                </summary>
                <ul className="text-lg">
                  <li onClick={() => handleScroll(notesRef)}>
                    <a>注記</a>
                  </li>
                  <li onClick={() => handleScroll(placesRef)}>
                    <a>訪問する場所</a>
                  </li>
                  {plan.flights && !!plan.flights.length && (
                    <li onClick={() => handleScroll(flightsRef)}>
                      <a>航空券</a>
                    </li>
                  )}
                  {plan.hotels && !!plan.hotels.length && (
                    <li onClick={() => handleScroll(hotelsRef)}>
                      <a>宿泊</a>
                    </li>
                  )}
                </ul>
              </details>
            </li>
            <li>
              <details open>
                <summary
                  className="font-semibold text-xl"
                  onClick={() => handleScroll(itineraryRef)}
                >
                  旅程
                </summary>
                <ul className="text-lg">
                  {formattedDays?.map((day) => (
                    <li key={`day-${day.id}`}>
                      <a>{day.dateFormatShort}</a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <button
              className="btn btn-ghost w-[164px] fixed bottom-0"
              onClick={toggleSideMenu}
            >
              <span className="material-icons">keyboard_double_arrow_left</span>
              非表示
            </button>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlanLayout;
