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
            <strong>accio</strong>&trade;
          </h1>
          <button
            onClick={handleLogout}
            className="btn btn-lg btn-primary font-weight-bold text-capitalize"
          >
            Logout
          </button>
        </div>
      </section>
      {props.children}
    </>
  );
}
