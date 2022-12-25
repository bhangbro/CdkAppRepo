import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import * as AppStack from '../../lib/stacks/app_stack';


// TODO add tests
test('Empty Stack', () => {
  const app = new cdk.App();
  //   // WHEN
  // const stack = new AppStack.AppStack(app, 'MyTestStack');
  //   // THEN
  //   expectCDK(stack).to(matchTemplate({
  //     "Resources": {}
  //   }, MatchStyle.EXACT))
});
