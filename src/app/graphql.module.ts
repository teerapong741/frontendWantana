import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

const uri = `http://localhost:3000`;

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: uri,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphqlModule {}
