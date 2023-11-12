import { ApiProvider } from '~/types/api'
import { paths } from '~/types/swagger'
import { OpArgType, OpenapiPaths, OpReturnType } from '~/types/fetcher'

export class Api {
  constructor(apiProvider: ApiProvider) {
    this.apiProvider = apiProvider
  }

  apiProvider: ApiProvider

  private fetcher<Paths>() {
    return {
      path: <P extends keyof Paths>(path: P) => ({
        method: <M extends keyof Paths[P]>(method: M) => ({
          create: () => {
            switch (method) {
              case 'get':
                return (
                  params: OpArgType<Paths[P][M]>
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      query: params as any
                    }
                  )
                }
              case 'post':
                return (
                  params: OpArgType<Paths[P][M]>
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      method: 'POST',
                      body: params as any
                    }
                  )
                }
              case 'put':
                return (
                  params: OpArgType<Paths[P][M]>
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      method: 'PUT',
                      body: params as any
                    }
                  )
                }
              case 'delete':
                return (
                  params: OpArgType<Paths[P][M]>
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      method: 'DELETE',
                      body: params as any
                    }
                  )
                }
              default:
                break
            }
          }
        })
      })
    }
  }

  private Fetcher = {
    for: <Paths extends OpenapiPaths<Paths>>() => this.fetcher<Paths>()
  }

  ft = this.Fetcher.for<paths>()
}
