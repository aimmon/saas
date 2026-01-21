import { getAllConfigs } from "@/shared/model/config.model"
import { CreemAdapter } from "./adapter/creem"
import type { PaymentAdapter } from "./adapter/interface"
import { StripeAdapter } from "./adapter/stripe"

export class PaymentService {
  private readonly adapter: PaymentAdapter
  public readonly provider: string

  private constructor(adapter: PaymentAdapter, provider: string) {
    this.adapter = adapter
    this.provider = provider
  }

  static async create(): Promise<PaymentService> {
    const configs = await getAllConfigs()
    const provider = configs.payment_provider

    let adapter: PaymentAdapter
    switch (provider) {
      case "stripe":
        adapter = new StripeAdapter(
          configs.payment_stripe_secret_key,
          configs.payment_stripe_webhook_secret
        )
        break
      case "creem":
        adapter = new CreemAdapter(
          configs.payment_creem_x_api_key,
          configs.payment_creem_test_mode,
          configs.payment_creem_webhook_secret
        )
        break
      default:
        throw new Error(`Unsupported payment adapter: ${provider}`)
    }

    return new PaymentService(adapter, provider)
  }

  async createCheckout(params: Parameters<PaymentAdapter["createCheckout"]>[0]) {
    return this.adapter.createCheckout(params)
  }

  async getSubscriptionsByUserId(params: Parameters<PaymentAdapter["getSubscriptionsByUserId"]>[0]) {
    return this.adapter.getSubscriptionsByUserId(params)
  }

  async handleWebhookEvent(payload: string, signature: string) {
    return this.adapter.handleWebhookEvent(payload, signature)
  }
}
