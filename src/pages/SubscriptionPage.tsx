import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { subscriptionService } from '@/services/subscriptionService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const planIcons: Record<string, React.ReactNode> = {
  Free: <Zap className="w-6 h-6" />,
  Pro: <Sparkles className="w-6 h-6" />,
  Premium: <Crown className="w-6 h-6" />,
};

const SubscriptionPage = () => {
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionService.getMySubscription(),
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getPlans(),
  });

  const checkoutMutation = useMutation({
    mutationFn: (planId: string) => subscriptionService.createCheckoutSession(planId),
    onSuccess: (data) => {
      if (data.url && data.url !== '#') {
        window.location.href = data.url;
      } else {
        toast.info('Stripe checkout will redirect here when backend is connected.');
      }
    },
    onError: () => toast.error('Failed to start checkout.'),
  });

  const isLoading = subLoading || plansLoading;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Unlock premium features like scheduled publishing, AI image generation, and paid galleries.
        </p>
        {subscription && subscription.status === 'active' && (
          <Badge variant="secondary" className="mt-4 text-sm px-4 py-1">
            Current plan: <span className="font-semibold capitalize ml-1">{subscription.plan}</span>
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map(plan => {
            const isCurrent = subscription?.plan === plan.name.toLowerCase();
            const isPopular = plan.name === 'Pro';

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 flex flex-col transition-all ${
                  isPopular
                    ? 'border-primary bg-primary/5 glow-primary'
                    : 'border-border bg-card'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3">Most Popular</Badge>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${isPopular ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    {planIcons[plan.name] || <Zap className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-2xl font-bold text-foreground">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                  disabled={isCurrent || checkoutMutation.isPending}
                  onClick={() => checkoutMutation.mutate(plan.id)}
                >
                  {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
