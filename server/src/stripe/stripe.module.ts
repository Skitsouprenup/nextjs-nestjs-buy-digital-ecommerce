import { DynamicModule, Module, Provider } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/shared/utilities/constants';
import Stripe from 'stripe';

@Module({})
export class StripeModule {
  static forRoot(
    apiKey: string,
    configuration: Stripe.StripeConfig,
  ): DynamicModule {
    const stripe: Stripe = new Stripe(apiKey, configuration);

    /*
      Create a provider so that we can inject stripe instance
      in every module where this module is shared. Make sure 
      this is registered in the providers property of the module
      then export it to the exports property so that the provider
      can be injected.
    */
    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe,
    };

    return {
      module: StripeModule,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true,
    };
  }
}
