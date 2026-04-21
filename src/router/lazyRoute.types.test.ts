import { lazyRoute } from './lazyRoute';

const LoginRoute = lazyRoute(() => import('@/pages/LoginPage'), 'LoginPage');

// @ts-expect-error Route export names must exist on the imported module.
const BrokenRoute = lazyRoute(() => import('@/pages/LoginPage'), 'MissingPage');

void LoginRoute;
void BrokenRoute;
