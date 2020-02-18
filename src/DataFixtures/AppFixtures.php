<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * AppFixtures constructor.
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * Load data fixtures with the passed EntityManager
     */
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');


        for ($u = 0; $u < 100; $u++) {
            $user = new User();

            $chrono = 1;

            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstName($faker->firstName)
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            try {
                for ($c = 0, $cMax = random_int(5, 100); $c < $cMax; $c++) {
                    $customer = new Customer();
                    $customer->setFirstName($faker->firstName)
                        ->setLastName($faker->lastName)
                        ->setCompany($faker->company)
                        ->setEmail($faker->email)
                        ->setUser($user);

                    $manager->persist($customer);

                    for ($i = 0, $iMax = random_int(1, 100); $i < $iMax; $i++) {
                        $invoice = new Invoice();
                        $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement([
                                'SENT',
                                'PAID',
                                'CANCELLED'
                            ]))
                            ->setCustomer($customer)
                            ->setChrono($chrono);

                        $chrono++;

                        $manager->persist($invoice);
                    }

                }
            } catch (\Exception $e) {
            }
        }


        $manager->flush();
    }
}
