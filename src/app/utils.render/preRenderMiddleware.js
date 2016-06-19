export default function preRenderMiddleware(dispatch, components, params) {
  return Promise.all(
    components
      .filter(component => component.loadAsyncData)
      .map(component => component.loadAsyncData(dispatch))
  );
}
