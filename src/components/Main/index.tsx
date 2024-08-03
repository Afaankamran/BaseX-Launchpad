const Main = ({ children }) => (
  <main
    className="flex flex-col items-center justify-start flex-grow w-full h-full max-w-[2000px] mx-auto"
    style={{
      height: 'max-content',
      //  minHeight: 'calc(100vh - 130px)'
    }}
  >
    {children}
  </main>
);

export default Main;
