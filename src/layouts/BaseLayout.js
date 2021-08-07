import { supabase } from "../lib/api";

export default function BaseLayout(props) {
  const handleLogout = async () => {
    supabase.auth.signOut().catch(console.error);
  };

  return (
    <>
      <section className="bg-dark shadow">
        <div className=" d-flex p-3 justify-content-between align-items-center">
          <h1 className="text-white font-weight-bold mt-2">
            <strong>accio</strong> - a developer's secret
          </h1>
          <button
            onClick={handleLogout}
            className="btn btn-lg btn-primary text-white font-weight-bold text-capitalize"
          >
            Logout
          </button>
        </div>
      </section>
      <div
        style={{ minHeight: "90vh" }}
        className="d-flex justify-content-center align-items-center mt-md-0 mt-5 pt-5 pb-5"
      >
        {props.children}
      </div>
    </>
  );
}
