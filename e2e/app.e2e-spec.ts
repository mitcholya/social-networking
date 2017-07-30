import { SocialNetworkingPage } from './app.po';

describe('social-networking App', () => {
  let page: SocialNetworkingPage;

  beforeEach(() => {
    page = new SocialNetworkingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
