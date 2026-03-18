import React from "react";
import { Footnote } from "@/components/Footnote";

export function Lesson01EN() {
  return (
    <div className="space-y-10 font-sans leading-relaxed text-stone-800 dark:text-stone-200">

      {/* Definitions */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Definitions</h2>
        <ul className="list-decimal list-outside ml-5 mt-4 space-y-3">
          <li><strong>A bare noun</strong> is a base word without any form of determination (definiteness), which often takes the form of prefixes.</li>
          <li><strong>A determined (definite) noun</strong> is provided with a determiner, frequently in the form of a prefix.</li>
        </ul>
      </section>

      {/* Vocabulary */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Vocabulary: Bare Nouns</h2>
        <div className="mt-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800">
                <th colSpan={2} className="p-3 border-b dark:border-stone-700 font-semibold text-center">Masculine <span style={{ fontVariant: 'small-caps' }}>m</span></th>
                <th colSpan={2} className="p-3 border-b dark:border-stone-700 font-semibold text-center">Feminine <span style={{ fontVariant: 'small-caps' }}>f</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲣⲱⲙⲓ</td>
                <td className="p-3">“man, human”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥ̀ϩⲓⲙⲓ</td>
                <td className="p-3">“woman, wife”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲓⲱⲧ</td>
                <td className="p-3">“father”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲙⲁⲩ</td>
                <td className="p-3">“mother”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥⲟⲛ</td>
                <td className="p-3">“brother”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</td>
                <td className="p-3">“sister”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϣⲏⲣⲓ</td>
                <td className="p-3">“son”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϣⲉⲣⲓ</td>
                <td className="p-3">“daughter”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲕⲁϩⲓ</td>
                <td className="p-3">“earth”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲫⲉ</td>
                <td className="p-3">“heaven, sky”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁⲅⲓⲟⲥ</td>
                <td className="p-3">“saint”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲉⲕⲕ̀ⲗⲏⲥⲓⲁ̀</td>
                <td className="p-3">“church”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϯⲙⲓ</td>
                <td className="p-3">“village”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲡⲟⲗⲓⲥ</td>
                <td className="p-3">“city”</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Significant Letters */}
      <section className="bg-stone-100 dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
        <h3 className="font-bold text-lg mb-3">Significant Letters:</h3>
        <ul className="space-y-2">
          <li><strong>Masculine <span style={{ fontVariant: 'small-caps' }}>m</span>:</strong> <span className="font-coptic text-lg">ⲡ</span> /p/, <span className="font-coptic text-lg">ⲫ</span> /pʰ/, <span className="font-coptic text-lg">ϥ</span> /f/</li>
          <li><strong>Feminine <span style={{ fontVariant: 'small-caps' }}>f</span>:</strong> <span className="font-coptic text-lg">ⲧ</span> /t/, <span className="font-coptic text-lg">ⲑ</span> /tʰ/, <span className="font-coptic text-lg">ⲥ</span> /s/</li>
          <li><strong>Plural <span style={{ fontVariant: 'small-caps' }}>p</span><Footnote number={1} content={<><span style={{ fontVariant: 'small-caps' }}>p</span> stands for plural.</>} />:</strong> <span className="font-coptic text-lg">ⲛ</span> /n/, <span className="font-coptic text-lg">ⲟⲩ</span> /u/</li>
        </ul>
      </section>

      {/* Determiner Selection */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Determiner Selection (Prefixes)</h2>
        <p className="mt-4 mb-2 italic">Example words: <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲟⲛ</span> “brother” / <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</span> “sister” / <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</span> “sisters”</p>
        <div className="mt-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800">
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Type</th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Masculine <span style={{ fontVariant: 'small-caps' }}>m</span></th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Feminine <span style={{ fontVariant: 'small-caps' }}>f</span></th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Plural <span style={{ fontVariant: 'small-caps' }}>p</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Indefinite</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲟⲩ</strong>ⲥⲟⲛ</span><Footnote number={2} content={<><span className="font-coptic">Ⲟⲩ-</span> comes from <span className="font-coptic">ⲟⲩⲁⲓ</span> (the number “one”). Compare with French un/une (articles), but also: un, deux, trois, … (numbers).</>} /> “a brother”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲟⲩ</strong>ⲥⲱⲛⲓ</span> “a sister”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ϩⲁⲛ</strong>ⲥⲱⲛⲓ</span><Footnote number={3} content={<><span className="font-coptic">Ϩⲁⲛ-</span> comes from <span className="font-coptic">ϩⲟⲓ̈ⲛⲉ</span> “some”. There is no direct English equivalent for the indefinite plural article <span className="font-coptic">ϩⲁⲛ-</span>.</>} /> “sisters”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Definite (long)</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡⲓ</strong>ⲥⲟⲛ</span> “the brother”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ϯ</strong>ⲥⲱⲛⲓ</span><Footnote number={4} content={<><span className="font-coptic">Ⲧ + ⲓ = ϯ</span>. Therefore: <span className="font-coptic">ϯⲥⲱⲛⲓ</span>.</>} /> “the sister”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲛⲓ</strong>ⲥⲱⲛⲓ</span> “the sisters”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Definite (short)</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡ̀</strong>ⲥⲟⲛ</span> “the brother”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲧ̀</strong>ⲥⲱⲛⲓ</span> “the sister”</td>
                <td className="p-3 text-stone-500 italic">(No short form)</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Possessive</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡⲁ</strong>ⲥⲟⲛ</span> “my brother”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲧⲁ</strong>ⲥⲱⲛⲓ</span> “my sister”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲛⲁ</strong>ⲥⲱⲛⲓ</span> “my sisters”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Demonstrative</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡⲁⲓ</strong>ⲥⲟⲛ</span> “this brother”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲧⲁⲓ</strong>ⲥⲱⲛⲓ</span> “this sister”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲛⲁⲓ</strong>ⲥⲱⲛⲓ</span> “these sisters”</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-stone-500">Note: <span className="font-coptic">ⲡⲓ-</span> and <span className="font-coptic">ⲡ̀-</span> are synonyms. We refer to them as long vs. short definite articles.</p>
      </section>

      {/* Zero Determination */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Zero-Determination</h2>
        <p className="mt-4 mb-3">
          Coptic is a highly determined language. Often (90% of the time), nouns are provided with a determiner (prefix). However, there are a few exceptions where nouns can appear without a determiner. This occurs, for example, with the quantifier <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">ⲛⲓⲃⲉⲛ</span> “every/each”.
        </p>
        <ul className="space-y-2 bg-stone-50 dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲣⲱⲙⲓ ⲛⲓⲃⲉⲛ</span> “every man”</li>
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲥ̀ϩⲓⲙⲓ ⲛⲓⲃⲉⲛ</span> “every woman”</li>
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲁⲅⲓⲟⲥ ⲛⲓⲃⲉⲛ</span> “every saint”</li>
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲉⲕⲕ̀ⲗⲏⲥⲓⲁ̀ ⲛⲓⲃⲉⲛ</span> “every church”</li>
        </ul>
      </section>

      {/* Nominal Sentences */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Bipartite Nominal Sentence (Predicate + Subject)</h2>
        <p className="mt-4 mb-3">
          There are three connecting pronouns (copulas) in Coptic. They only appear after the first word (or the first phrase) of the sentence. We call these words postpositive (placed after) or enclitic (leaning on the preceding word). We mark these with the symbol '≡'.
        </p>
        <ul className="space-y-2 mb-4 text-emerald-600 dark:text-emerald-400">
          <li>≡<span className="font-coptic text-lg">ⲡⲉ</span> <span style={{ fontVariant: 'small-caps' }}>m</span> “he, it”<Footnote number={5} content={<>In Coptic, there is no specific word for the neuter “it”.</>} /></li>
          <li>≡<span className="font-coptic text-lg">ⲧⲉ</span> <span style={{ fontVariant: 'small-caps' }}>f</span> “she, it”</li>
          <li>≡<span className="font-coptic text-lg">ⲛⲉ</span> <span style={{ fontVariant: 'small-caps' }}>p</span> “they”</li>
        </ul>
        <div className="bg-sky-50 dark:bg-sky-900/30 p-5 rounded-xl border border-sky-100 dark:border-sky-800">
          <h3 className="font-bold text-lg mb-3">Applications:</h3>
          <p className="mb-4 text-sm">
            In Coptic (just like in Semitic languages such as Hebrew or Arabic), there is no verb 'to be' in the present tense. However, in English, we are required to use it, otherwise the translation is incorrect.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li><span className="font-coptic text-xl">Ⲟⲩⲓⲱⲧ ⲡⲉ.</span> <br />“He is a father.”</li>
            <li><span className="font-coptic text-xl">Ⲡⲁⲓⲱⲧ ⲡⲉ.</span> <br />“He is my father.”</li>
            <li><span className="font-coptic text-xl">Ⲡⲁⲓⲓⲱⲧ ⲡⲉ.</span> <br />“It is this father.”</li>
            <li><span className="font-coptic text-xl">Ⲧⲁⲙⲁⲩ ⲧⲉ.</span> <br />“She is my mother.”</li>
            <li><span className="font-coptic text-xl">Ⲟⲩⲥ̀ϩⲓⲙⲓ ⲧⲉ.</span> <br />“She is a woman.”</li>
            <li><span className="font-coptic text-xl">Ϩⲁⲛⲥⲱⲛⲓ ⲛⲉ.</span> <br />“They are sisters.”</li>
            <li><span className="font-coptic text-xl">Ϩⲁⲛⲣⲱⲙⲓ ⲛⲉ.</span> <br />“They are men.”</li>
            <li><span className="font-coptic text-xl">Ⲛⲓⲁⲅⲓⲟⲥ ⲛⲉ.</span> <br />“They are the saints.”</li>
          </ul>
        </div>
      </section>

      {/* Independent Pronouns */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Independent Personal Pronouns</h2>
        <p className="mt-4 mb-3">
          Besides the connecting pronouns, there are also independent personal pronouns. In a bipartite nominal sentence, using the connecting pronouns is the standard (mandatory) rule. To emphasize such nominal sentences, one can also incorporate the independent personal pronouns. These are prepositive (placed before):
        </p>
        <ul className="flex flex-wrap gap-4 mb-6">
          <li className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg"><span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲛ̀ⲑⲟϥ</span> <span style={{ fontVariant: 'small-caps' }}>m</span> “he, it”</li>
          <li className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg"><span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲛ̀ⲑⲟⲥ</span> <span style={{ fontVariant: 'small-caps' }}>f</span> “she, it”</li>
          <li className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg"><span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲛ̀ⲑⲱⲟⲩ</span> <span style={{ fontVariant: 'small-caps' }}>p</span> “they”</li>
        </ul>
        <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <h3 className="font-bold mb-3 text-sm uppercase tracking-widest text-stone-500">Examples</h3>
          <ul className="space-y-3">
            <li><span className="font-coptic text-xl">Ⲛ̀ⲑⲟϥ</span>, <span className="font-coptic text-lg">ⲡⲁⲓⲱⲧ ⲡⲉ.</span> “<i>He</i> is my father.”</li>
            <li><span className="font-coptic text-xl">Ⲛ̀ⲑⲟⲥ</span>, <span className="font-coptic text-lg">ⲧⲁⲙⲁⲩ ⲧⲉ.</span> “<i>She</i> is my mother.”</li>
            <li><span className="font-coptic text-xl">Ⲛ̀ⲑⲱⲟⲩ</span>, <span className="font-coptic text-lg">ⲛⲁⲥⲱⲛⲓ ⲛⲉ.</span> “<i>They</i> are my sisters.”</li>
          </ul>
        </div>
      </section>

      {/* Abbreviations */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Abbreviations</h2>
        <p className="mt-4 mb-3">
          In Coptic literature, several common abbreviations are used, mostly to indicate holy names ("nomina sacra"). The conventional way to represent abbreviations in Coptic is by placing a horizontal line above the abbreviated word.
        </p>
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-400 italic">
          In a liturgical context, word abbreviations can also sometimes refer to common phrases:
        </p>
        <ul className="space-y-2 mb-6">
          <li><span className="font-coptic text-lg">ⲕ̅ⲉ̅</span> = <span className="font-coptic text-md">ⲕⲩⲣⲓⲉ̀ ⲉⲗⲏⲥⲟⲛ</span> “Lord have mercy”</li>
          <li><span className="font-coptic text-lg">ⲭ︦ⲉ︦</span> = <span className="font-coptic text-md">ⲭⲉⲣⲉ ⲛⲉ Ⲙⲁⲣⲓⲁ</span> “Hail Mary”</li>
          <li><span className="font-coptic text-lg">ⲛ︦ⲧ︦ⲉ︦ϥ︦</span> = <span className="font-coptic text-md">ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓⲛⲁⲛ ⲉ̀ⲃⲟⲗ</span> “to forgive us our sins”</li>
          <li><span className="font-coptic text-lg">ⲧ︦ⲱ︦ⲃ︦</span> = <span className="font-coptic text-md">ⲧⲱⲃϩ ⲙ̀Ⲡ̀ϭⲱⲓⲥ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ</span> “pray to the Lord for us”</li>
        </ul>

        <div className="w-full rounded-lg border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800">
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Full Word</th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Abbreviation</th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁⲗⲗⲏⲗⲟⲩⲓⲁ̀</td>
                <td className="p-3 font-coptic text-xl">ⲁ̅ⲗ̅</td>
                <td className="p-3">“hallelujah”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁ̀ⲙⲏⲛ</td>
                <td className="p-3 font-coptic text-xl">ⲁ̅ⲙ̅</td>
                <td className="p-3">“amen”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥⲱⲧⲏⲣ</td>
                <td className="p-3 font-coptic text-xl">ⲥ̅ⲱ̅ⲣ̅, ⲥ̅ⲣ̅</td>
                <td className="p-3">“savior”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϭⲱⲓⲥ<Footnote number={6} content={<>In older church books and presentations, this is often archaically written as <span className="font-coptic">ϭⲟⲓⲥ</span>. The standard modern Bohairic spelling is <span className="font-coptic">ϭⲱⲓⲥ</span>.</>} /></td>
                <td className="p-3 font-coptic text-xl">͞⳪̅, ϭ̅ⲥ̅</td>
                <td className="p-3">“lord, lady”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲕⲩⲣⲓⲟⲥ (-ⲉ̀)</td>
                <td className="p-3 font-coptic text-xl">ⲕ̅ⲉ̅</td>
                <td className="p-3">“lord”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲭⲉⲣⲉ</td>
                <td className="p-3 font-coptic text-xl">ⲭ̅ⲉ̅</td>
                <td className="p-3">“hail / greetings”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲓⲏⲥⲟⲩⲥ N<sup className="italic" style={{ fontVariant: 'small-caps' }}>m</sup><Footnote number={7} content={<>N<sup className="italic" style={{ fontVariant: 'small-caps' }}>m</sup> is the abbreviation/symbol for a Nomen (proper noun/name).</>} /></td>
                <td className="p-3 font-coptic text-xl">Ⲓⲏ̅ⲥ̅, Ⲓⲥ̅, Ⲓ᷍ⲥ</td>
                <td className="p-3"><i>Jesus</i></td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲡⲓⲭⲣⲓⲥⲧⲟⲥ N<sup className="italic" style={{ fontVariant: 'small-caps' }}>m</sup></td>
                <td className="p-3 font-coptic text-xl">Ⲡⲭ̅ⲥ̅, Ⲡⲭ᷍ⲥ</td>
                <td className="p-3"><i>Christ</i></td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲡ̀ⲛⲉⲩⲙⲁ</td>
                <td className="p-3 font-coptic text-xl">ⲡ̅ⲛ̅ⲁ̅</td>
                <td className="p-3">“spirit”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲉ̀ⲑⲟⲩⲁⲃ</td>
                <td className="p-3 font-coptic text-xl">ⲉ̅ⲑ̅ⲩ̅, ⲉ̅ⲑ̅</td>
                <td className="p-3">“holy”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲫ̀ⲛⲟⲩϯ</td>
                <td className="p-3 font-coptic text-xl">ⲫ︦ϯ︦, ⲫ᷍ϯ, ⲫ̀ϯ</td>
                <td className="p-3">“(the) God”</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Exercises */}
      <section className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-xl border border-sky-100 dark:border-sky-900 mt-10">
        <h2 className="text-xl font-bold mb-4 text-sky-700 dark:text-sky-400">🎓 Exercise 01</h2>
        <p className="mb-4">Translate the following nominal expressions into Coptic (one solution is sufficient).</p>
        <ol className="list-decimal list-inside space-y-2 font-medium">
          <li>She is my daughter.</li>
          <li>She is my wife.</li>
          <li>It is heaven.</li>
          <li>She is a lady.</li>
          <li>They are the ladies.</li>
          <li>He is a spirit.</li>
          <li>It is the spirit.</li>
          <li>Every city.</li>
          <li>Every man.</li>
          <li>The lord, the savior.</li>
        </ol>
      </section>

    </div>
  );
}
