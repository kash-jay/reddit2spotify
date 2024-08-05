import Form from "./components/Form";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    <div className="text-neutral-content">
      <Form />
    </div>
  );
}

export default App;
