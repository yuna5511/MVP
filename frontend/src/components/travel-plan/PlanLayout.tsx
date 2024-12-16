import { useRef, useState } from 'react';
import { useFormattedDays } from '../../hooks/useFormattedDays';
import ExpandPanel from '../shared/ExpandPanel';
import PlacesList from './PlacesList';
import ItineraryLayout from './ItineraryLayout';
import CalendarButton from '../shared/CalendarButton';
import { usePlanStore, PlanState } from '../../stores/planStore';

const PlanLayout = () => {
  const notesRef = useRef(null);
  const placesRef = useRef(null);
  const flightsRef = useRef(null);
  const hotelsRef = useRef(null);
  const itineraryRef = useRef(null);
  const [showSideMenu, setShowSideMenu] = useState(true);
  const plan = usePlanStore((state: PlanState) => state.plan);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleScroll = (ref: any) => {
    if (ref && ref?.current) {
      const el = ref.current;
      const top = window.scrollY + el.getBoundingClientRect().top;
      window.scrollTo({ left: 0, top: top - 80, behavior: 'smooth' });
    }
  };
  // TODO: 予算セクション

  const formattedDays = useFormattedDays(
    plan ? plan.itinerary?.days : undefined
  );
  const toggleSideMenu = () => setShowSideMenu((prevState) => !prevState);

  // TODO:一時的な解決策
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_EMBED_KEY;
  const placeId =
    plan && plan.places.length > 0
      ? `place_id:${plan.places[0].google_place_id}`
      : 'Japan';
  const googleEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${placeId}&zoom=17`;

  if (!plan) return null;

  return (
    <>
      <div className={`drawer ${showSideMenu ? 'drawer-open' : ''} h-full`}>
        <input
          id="my-drawer-expanded"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex w-full max-h-full">
          <ul
            className={`collapsed-menu menu bg-base-200 min-h-full p-4 fixed left-0 top-[64px] ${!showSideMenu ? 'opacity-100' : 'opacity-0'} transition-opacity ease-in-out delay-150 duration-300`}
          >
            <li onClick={handleScrollToTop}>
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
            className={`flex flex-grow min-w-[480px] w-3/5 ${showSideMenu ? 'max-w-[calc(60%-80px)]' : 'max-w-[60%]'}`}
          >
            <div
              className={`plan-form-container flex flex-col ${!showSideMenu ? 'ml-[88px]' : ''} items-center overflow-y-auto h-full w-full gap-7`}
            >
              <div className="flex flex-col items-center px-14 pt-9 w-full">
                <div className="card bg-base-100 w-full max-w-[560px] shadow-lg h-44">
                  <div className="card-body flex flex-col justify-between px-6 py-5">
                    <input
                      type="text"
                      placeholder="旅行名を入力してください"
                      className="input w-full font-bold text-3xl"
                      value={plan.title}
                    />
                    <div className="flex justify-between">
                      <CalendarButton
                        startDate={plan.itinerary.start_date}
                        endDate={plan.itinerary.end_date}
                      />
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
                  <ExpandPanel parentRef={notesRef} title="注記">
                    <div className="card bg-base-200 w-full">
                      <div className="card-body p-2">
                        <textarea
                          className="textarea textarea-ghost w-full"
                          placeholder="ここに何でも書き込んでください。"
                        ></textarea>
                      </div>
                    </div>
                  </ExpandPanel>
                  <ExpandPanel
                    parentRef={placesRef}
                    title="訪問する場所"
                    collapsedDescription={
                      plan.places?.length
                        ? `${plan.places?.length}ヶ所`
                        : '0ヶ所'
                    }
                  >
                    <PlacesList list={plan.places} planId={plan.id} />
                  </ExpandPanel>
                </div>
              </div>
              <div className="bg-base-300 w-full h-[16px]"></div>
              <ItineraryLayout itineraryRef={itineraryRef} />
            </div>
          </div>
          <div className="map-container fixed w-2/5 h-full right-0 top-[64px]">
            <iframe width="100%" height="100%" src={googleEmbedUrl}></iframe>
          </div>
        </div>
        <div className="drawer-side h-full min-w-[200px] fixed top-[64px]">
          <label
            htmlFor="my-drawer-expanded"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu fixed bg-base-200 min-w-[200px] text-base-content min-h-[calc(100%-64px)] max-h-[calc(100%-64px)] p-4">
            <li>
              <details open>
                <summary
                  className="font-semibold text-xl"
                  onClick={handleScrollToTop}
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
            <div className="flex w-full z-50 fixed bottom-0 left-0 justify-center">
              <button
                className="btn btn-ghost w-[164px]"
                onClick={toggleSideMenu}
              >
                <span className="material-icons">
                  keyboard_double_arrow_left
                </span>
                非表示
              </button>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlanLayout;
